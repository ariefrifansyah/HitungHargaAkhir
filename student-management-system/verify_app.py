import urllib.request
import urllib.parse
import json
import time
import sys

BASE_URL = "http://localhost:8000/api/students"

def make_request(url, method="GET", data=None):
    if data:
        data = json.dumps(data).encode('utf-8')

    req = urllib.request.Request(url, data=data, method=method)
    req.add_header('Content-Type', 'application/json')

    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            return response.status, json.loads(res_body)
    except urllib.error.HTTPError as e:
        res_body = e.read().decode('utf-8')
        return e.code, json.loads(res_body)
    except Exception as e:
        print(f"Error: {e}")
        return None, None

def test_crud():
    print("Waiting for server to start...")
    time.sleep(3)

    # 1. READ (Initial)
    print("1. Testing GET /api/students")
    status, body = make_request(BASE_URL)
    print(f"Status: {status}")
    if status != 200:
        return False
    initial_count = len(body['data'])
    print(f"Initial count: {initial_count}")

    # 2. CREATE
    print("2. Testing POST /api/students")
    new_student = {
        "nim": "999",
        "name": "Test Student",
        "major": "Testing",
        "year": 2024
    }
    status, body = make_request(BASE_URL, "POST", new_student)
    print(f"Status: {status}")
    if status != 200:
        print(body)
        return False

    student_id = body['id']
    print(f"Created student ID: {student_id}")

    # 3. READ (Verify Create)
    print(f"3. Testing GET /api/students/{student_id}")
    status, body = make_request(f"{BASE_URL}/{student_id}")
    print(f"Status: {status}")
    if body['data']['name'] != "Test Student":
        print("Data mismatch after create")
        return False

    # 4. UPDATE
    print(f"4. Testing PUT /api/students/{student_id}")
    update_data = {
        "name": "Updated Student"
    }
    status, body = make_request(f"{BASE_URL}/{student_id}", "PUT", update_data)
    print(f"Status: {status}")

    # 5. READ (Verify Update)
    print(f"5. Testing GET /api/students/{student_id}")
    status, body = make_request(f"{BASE_URL}/{student_id}")
    if body['data']['name'] != "Updated Student":
        print("Data mismatch after update")
        return False

    # 6. DELETE
    print(f"6. Testing DELETE /api/students/{student_id}")
    status, body = make_request(f"{BASE_URL}/{student_id}", "DELETE")
    print(f"Status: {status}")

    # 7. READ (Verify Delete)
    print(f"7. Testing GET /api/students/{student_id}")
    status, body = make_request(f"{BASE_URL}/{student_id}")

    # If data key exists and is not None, then it wasn't deleted
    if body and 'data' in body and body['data'] is not None:
        print("Student still exists after delete")
        return False

    print("All CRUD tests passed!")
    return True

if __name__ == "__main__":
    if not test_crud():
        sys.exit(1)
