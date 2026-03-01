"""Test the /medicines endpoint directly"""
import requests
import json

# Test data without status
test_data = {
    "name": "Test Medicine",
    "quantity": 100,
    "expiry_date": "2026-12-31"
}

print("Testing POST /medicines endpoint...")
print(f"Sending data: {json.dumps(test_data, indent=2)}")

try:
    response = requests.post(
        "http://localhost:8001/medicines",
        json=test_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 201:
        print("\nSUCCESS: Medicine created!")
    else:
        print(f"\nERROR: Request failed with status {response.status_code}")
        try:
            error_detail = response.json()
            print(f"Error details: {json.dumps(error_detail, indent=2)}")
        except:
            print(f"Error text: {response.text}")
            
except requests.exceptions.ConnectionError:
    print("\nERROR: Could not connect to backend. Is it running on port 8001?")
except Exception as e:
    print(f"\nERROR: {e}")
