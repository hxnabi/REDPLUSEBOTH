"""
Development server runner.
Quick way to start the FastAPI server.
"""
import uvicorn
import sys

if __name__ == "__main__":
    print("🏥 Starting Red Connect API Server...")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔄 Press CTRL+C to stop the server\n")
    
    try:
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Server stopped!")
        sys.exit(0)

