# privyr-lead

![Imgur](https://i.imgur.com/1ZNY2vP.png)

## Prequisite

- Yarn 1.22.5
- NodeJS v14.17.0

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

### `/servers`

The directory contains server backend code which responsible manage the API and webhooks.

### `/pages`

This directory contains the frontend views and routes.

## 2. API Documentation

The backend expose several `REST API` endpoints that enable the frontend side to manage webhook and lead data.

### 2A. Get user's leads

---

Get the leads of the specific users

**URL:** `/api/v1/users/:userId/leads`

**Method:** `GET`

**Query Parameters**:
| **Name** | **Type** | **Description** |
| --- | --- | --- |
| after | string | a cursor to load more specific leads after certain time. It's a firebase timestamp format of `seconds:nanoseconds` |
| limit | number | how much the data being fetched |

**Sample URL:** `https://privyr-lead.vercel.app/api/v1/users/123/leads?after=1656575698:214000000&limit=3`

**Sample Response**

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
      },
      "createdAt": {
        "_seconds": 1656645132,
        "_nanoseconds": 517000000
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
      },
      "createdAt": {
        "_seconds": 1656597415,
        "_nanoseconds": 218000000
      },
    },
  ]
}
```

### 2B. Get user's webhook id

---

To obtain the identifier of webhook where it will be used as the webhook url param.

**URL:** `/api/v1/users/:userId/webhook`

**Method:** `GET`

**Sample Response**

```
{
  "success": true,
  "data": "umP2KXAhrhakNfA8UVoSg"
}
```

### 2C. Regenerate Webhook ID

---

It will allow users to have a new webhook ID and make the previous ID obsolete. This will be useful for creating webhook for the first time, or when users want to deprecate the old webhook id in case it's being leaked or being used maliciously.

**URL:** `/api/v1/users/:userId/webhook`

**Method:** `PUT`

**Sample Response**

```
{
  "success": true,
  "data": {
    "webhookId": "FsOCGcVctYT6t5_7WnbUA"
  }
}
```

## 3. Webhook

Each user will be able to generate a unique webhook url, which power one-way data sharing triggered by an external source.

It will enable the system to listen to any new incoming lead information and store it into database. To obtain the webhook URL, one can access the user related page (ie. `https://privyr-lead.vercel.app/leads/123`)

**URL:** `{baseUrl}/webhooks/:webhookId`

**Sample URL:** `http://localhost:3000/FsOCGcVctYT6t5_7WnbUA`

### 3A. Input Payload

---

| Fields | Required? | Type   | Description                                                                                       |
| ------ | --------- | ------ | ------------------------------------------------------------------------------------------------- |
| name   | ✔️        | String | The name of the lead                                                                              |
| email  | ✔️        | String | The email address                                                                                 |
| phone  | ✔️        | String | The phone number                                                                                  |
| other  |           | Object | Flexible object key pair, that should contain any other detail information that worth to be added |

### 3B. CURL request

---

This is sample `curl` request that can be used to test the webhook.

```bash
curl --location --request POST 'https://privyr-lead.vercel.app/webhooks/y3qt3O1X5f4w8n3Qvi3uK' \
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

Several functionality that would be very good addition on top our system.

### 1. IP Whitelist

Only specific machine can send data into the webhook can prevent unauthorized access, and suitable for private usage of webhook.

### 2. Secret Key

Alternative of IP Whitelist, quite helpful to add additional security layer to make webhook more secure as long as the secret key isn't compromised.

### 3. URL Expiration

Suitable for temporary webhook usage, like doing test or just saving up some resource.

### 4. Rate Limit

This function help preventing flood request that can abuse the webhook usage. Also can be used as a subscription feature.

### 5. Webhook Logs

To help debug, monitor, or audit any incoming webhook. The log can contain IP address, the URL of webhook, datetime, response code, payload and so on.

### 6. Notification

Sometimes the webhook is not working as usual, any repeated errors occured when send a request to the webhook can trigger a notification alert to notify the webhook owner. The medium can be email, slack or even text message.
