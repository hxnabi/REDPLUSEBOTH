from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, Donor, Reward, DonorReward
from app.schemas import RewardResponse, DonorRewardResponse
from app.auth import get_current_user
from datetime import datetime

router = APIRouter()

# Default rewards to seed
DEFAULT_REWARDS = [
    {
        "name": "First Donation",
        "description": "Complete your first blood donation to unlock this reward",
        "icon": "Gift",
        "required_donations": 1
    },
    {
        "name": "Life Saver",
        "description": "Donate blood 5 times to earn this badge",
        "icon": "Heart",
        "required_donations": 5
    },
    {
        "name": "Champion Donor",
        "description": "Donate blood 10 times to become a champion",
        "icon": "Award",
        "required_donations": 10
    },
    {
        "name": "Hero",
        "description": "Donate blood 25 times",
        "icon": "Medal",
        "required_donations": 25
    },
    {
        "name": "Legend",
        "description": "Donate blood 50 times",
        "icon": "Crown",
        "required_donations": 50
    }
]

def ensure_rewards_seeded(db: Session):
    for reward_data in DEFAULT_REWARDS:
        existing = db.query(Reward).filter(Reward.name == reward_data["name"]).first()
        if not existing:
            new_reward = Reward(**reward_data)
            db.add(new_reward)
    db.commit()

@router.get("/", response_model=List[RewardResponse])
def get_all_rewards(db: Session = Depends(get_db)):
    ensure_rewards_seeded(db)
    return db.query(Reward).order_by(Reward.required_donations).all()

@router.get("/my-rewards", response_model=List[DonorRewardResponse])
def get_my_rewards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.donor_profile:
        raise HTTPException(status_code=400, detail="User is not a donor")
    
    ensure_rewards_seeded(db)
    donor = current_user.donor_profile
    
    # Check for new rewards
    all_rewards = db.query(Reward).order_by(Reward.required_donations).all()
    # Get IDs of rewards already earned
    earned_rewards = db.query(DonorReward).filter(DonorReward.donor_id == donor.id).all()
    earned_reward_ids = [dr.reward_id for dr in earned_rewards]
    
    new_rewards_added = False
    for reward in all_rewards:
        # Check if donor qualifies and hasn't earned it yet
        if (donor.total_donations or 0) >= reward.required_donations and reward.id not in earned_reward_ids:
            # Award this reward
            new_donor_reward = DonorReward(
                donor_id=donor.id,
                reward_id=reward.id,
                earned_at=datetime.utcnow()
            )
            db.add(new_donor_reward)
            new_rewards_added = True
    
    if new_rewards_added:
        db.commit()
        
    # Return all rewards for this donor
    return db.query(DonorReward).filter(DonorReward.donor_id == donor.id).all()
