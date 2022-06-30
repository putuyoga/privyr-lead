# privyr-lead

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

```

## 1. Directory Structures

---

### `/servers`

The directory contains server backend code which responsible manage the API and webhooks.

### `/pages`

This directory contains the frontend views and routes.

## 2. API Documentation

---

The backend expose several REST API endpoints that enable the frontend side to manage webhook and lead data.

### 2A. Get user's leads

---

Get the leads of the specific users

**URL:** `/api/users/:userId/leads`

**Method:** `GET`

**Example Response**

```
{
	"success": true,
	"body": [
		{
			"email": "markus@victor.com",
			"webhookId": "umP2KXAhrhakNfA8UVoSg",
			"name": "John",
			"phone": "0812341232",
			"other": {
				"address": "Midway street 25th",
				"source": "Facebook"
			}
		},
		{
			"name": "Markus Isakson",
			"webhookId": "uSFDSD22345fgDFo23",
			"email": "markus@victor.com",
			"phone": "+1241241",
			"other": {
				"referral": "Xavier",
				"source": "Whatsapp"
			}
		},
	]
}
```

### 2B. Get user's webhook id

---

To obtain the identifier of webhook where it will be used as the webhook url param.

**URL:** `/api/users/:userId/webhook`

**Method:** `GET`

**Example Response**

```
{
	"success": true,
	"data": "umP2KXAhrhakNfA8UVoSg"
}
```

### 2C. Regenerate Webhook ID

---

This will allow user to have new webhook ID and make the old ID obsolete. The webhook ID is randomly generated to make it hard to guess, so malicious user can't try to attempt to use the webhook.

**URL:** `/api/users/:userId/webhook`

**Method:** `PUT`

**Example Response**

```
{
	"success": true,
	"data": {
		"createdAt": {},
		"webhookId": "FsOCGcVctYT6t5_7WnbUA"
	}
}
```

## 3. Webhook

---

Each user will be able to generate a unique webhook url, which power one-day data sharing triggered by an event. It will enable the system to listen to any new incoming lead data.

**URL:** `{baseUrl}/webhooks/:webhookId`

**Sample URL:** `http://localhost:3000/FsOCGcVctYT6t5_7WnbUA`

### 3A. Input Payload

---

| Fields | Description                                                           |
| ------ | --------------------------------------------------------------------- |
| name   | **Mandatory**. String. The name of the lead                           |
| email  | **Mandatory**. String. The email address                              |
| phone  | **Mandatory**. String. The phone number                               |
| other  | Optional. Object. Any other detail information that worth to be added |

### 3B. CURL request

---

Here is the sample request using a curl

```bash
curl --location --request POST 'http://localhost:3000/FsOCGcVctYT6t5_7WnbUA' \
		--header 'Content-Type: application/json' \
		--data-raw '{	"name": "Mario Pozo",
									"email": "pozo@mario.com",
									"phone": "+16262223333",
									"other": {
												"address": "Miami avenue 27th",
												"gender": "male"
									}
}
'
```

### 3C. Worth to be added

---

- CSRF
- Signature
- Expiration
- Rate Limit
