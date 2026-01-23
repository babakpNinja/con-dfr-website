import urllib.request
import json

TOKEN = open('/workspace/.railway_token').read().strip()
SERVICE_ID = "6259b737-374c-4317-84ea-16a51c89d056"

# Query to get service details
query = '''
query {
  service(id: "%s") {
    id
    name
    repoTriggers {
      edges {
        node {
          branch
          repository
        }
      }
    }
  }
}
''' % SERVICE_ID

data = json.dumps({"query": query}).encode('utf-8')

req = urllib.request.Request(
    'https://backboard.railway.app/graphql/v2',
    data=data,
    headers={
        'Authorization': f'Bearer {TOKEN}',
        'Content-Type': 'application/json'
    }
)

try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(json.dumps(result, indent=2))
except Exception as e:
    print(f"Error: {e}")