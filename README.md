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

## Directory Structures

### `/servers`

The directory contains server backend code which responsible manage the API and webhooks.

### `/pages`

This directory contains the frontend views and routes.

## API Documentation

The backend expose several REST API endpoints that enable the frontend side to manage webhook and lead data.

### Get user's leads

---

Get the leads of the specific users

**URL:**: `/api/users/:userId/leads`

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
			"phone": "0812341232"
		},
		{
			"name": "Markus Isakson",
      "webhookId": "uSFDSD22345fgDFo23",
			"email": "markus@victor.com",
			"phone": "+1241241"
		},
	]
}
```

### Get user's webhook id

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

### Regenerate Webhook ID

---

This will allow user to have new webhook ID and make the old ID obsolete

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

## Webhook Structure
