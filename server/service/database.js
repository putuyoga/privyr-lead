
/**
 * TODO: instead of hardcoded like these,
 * should be stored in secure storage,
 * like environment variables or similiar things such as AWS Parameter Store,
 */
const firebase = require('firebase-admin')
const admin = !firebase.apps.length
  ? firebase.initializeApp({
      credential: firebase.credential.cert({
        "type": "service_account",
        "project_id": "privyr-lead",
        "private_key_id": "7c1e1e15975ecb52ee162d2c987196e0808a5140",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDOKh3WGBey5n1d\nJvF+VG/0HfLJwpJIIopqOFfEo54QotXd2sY5TbzC6tky+aVHSUuhOiVSIFqhJ25V\nbpTZw7VvqILQxx5IhvqfDbBJGeSFFbz7AQ8DBuNG34PTPO8PWYraGP7M+IOZpsy+\nEpHgrnIJSddxFKVCA2Z9k/VVl5MUpykCO6dV26+Xw7xxIMiac6QSVF9L7lhvIsks\nEmFMse+2JtduhtKXTbHsLRaRPATW3/v7mtN1LZNJagP9rSkmVJQ3GOgt3VcheO/J\n5YohaiQEQf3TKKNCH2ERKX5/tkCZ5qSeiM9aiQFP2XuPyQnw6eve1RNC6c0zhJtJ\n8ZhTKCd5AgMBAAECggEARUxY3RcaGDNrnj0x3YHqY8cRTgpN+1tI5W1s6xcIUZU6\niCk6ihZ8RZSFT6IkkTKs7lPKKbHgZN0JNERIWm5zdUXSOvVDU6OzaHVEdT3z11w4\nOrLfZegRy0fkWsPXo3Q4vRi7xRAfxC0SEy3QxRI+GKsudL840VitQbbTN2MMuFrh\nGOhX566yYvm0lrssRJhFk3kVBrNvNqMoJKdNCWGX9T+h8PK1apexfsxiCp7uGi0X\n43BV01PvosVosYe53CCOU4ctj6jkX1O/VCKS9fPH9Qq4xrWglL6VzdNrVM6kQHYJ\nXxeL1EoSjTSzkjvCrCfnH/+3wkoK94B9flLNSQbnZQKBgQD2KQ5FqnZLiDm2AY4i\n5hCX5Clp7U5Bnmhe32l6afJVSRfYBNypXBI74emBGqbTRNIOGasU7uN8iEyebcnC\nBMyBQN7KNHOJo7IP8MIcdpjYwK6vdRN6CgJOtHW4jOAAjmKO2GRo00szO3IezxLs\nnYC9VEx2Zdk252be00Ex+rmuXwKBgQDWZ8keCORZmAzt/eAUDJWY3iBC5WmZWoyq\nbTSFTrlP8tVMCQFBrbW8mOzkiGL1hfpV3IqvPy7ZfdoJJvf3stAhgqlXUHwJJrXp\nY/PxlU9cMqit6SWi4yB+WgnWPRiARfdqDF5+uaeX3UJLNKyHPbIxjVkHApRvvnZA\n9RN8QMrJJwKBgQDYqgJZ51P/34OMY4oLxZxNVRHunmUG9LrA5rwcdyxJTPCjvoPK\nvbN+6bVxYVf9FNIefxFKd4nbjsyBlfjDwR2Plt2B9PDM8TxFM5BnJSwbfF1FKjNe\nc3jcdZI4QibX1nuBZ43ZhkDmcyhbXcA2a9toyc4TWEn8PWkaL69uolTU2QKBgH5k\nTFEiWMrgMa8SnEf1azLkrwwAhZHbqVTGb9GuKNwSgN8D5/O53YrCc9P8+qlWQ87d\n5fuNOacI48HFcSRaCwvWJNHOJnCWm2Jsg+AEbvYg/wMWkBNH5V3W4jmjZpAnrsSb\nahE2jK+fxXbkJFjNbAB+HN9fC/Ybx0Zfsw7qeyC9AoGBAL4Z+8W5m0GlyYNa80M0\nMkbN+6U5XQFR0MpD2oPvnGU2FisvUnKKJAZNzhHh3ARipK4kK9qh2zC69x78lg41\nCEwljKMzYh7UgQfXpifZrg6LWSCusKmPb2MYi/lH8hwE8yPu7udSlDF2+xU8FvnH\nVMGPql4hTj8CZGijNwx3DwKP\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-yrtka@privyr-lead.iam.gserviceaccount.com",
        "client_id": "112839628159719698882",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-yrtka%40privyr-lead.iam.gserviceaccount.com"
      }),
    })
  : firebase.app()

module.exports = admin
