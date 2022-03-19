import boto3
import json
from urllib import request, parse
import os
import re

SRC_MAIL = "tannakaken@gmail.com"
DST_MAIL = "tannakaken@gmail.com"
REGION = "ap-northeast-1"

RECAPTCHA_API_URL = "https://www.google.com/recaptcha/api/siteverify"


def send_email(source, to, subject, body):
    client = boto3.client('ses', region_name=REGION)

    response = client.send_email(
        Source=source,
        Destination={
            'ToAddresses': [
                to,
            ]
        },
        Message={
            'Subject': {
                'Data': subject,
            },
            'Body': {
                'Text': {
                    'Data': body,
                },
            }
        }
    )

    return response


def lambda_handler(event, context):
    if event["requestContext"]["http"]["method"] == "OPTIONS":
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': 'https://www.example.com',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': ""
        }
    origin = event["headers"]["origin"]
    hostname = re.sub(":\d*", "", re.sub("https?://", "", origin))
    subject = "お問合せ"
    data = json.loads(event["body"])
    recaptcha_token = data['recaptchaToken']
    post_form_data = parse.urlencode({'secret': os.environ['RECAPTCHA_SECRET'], 'response': recaptcha_token})
    post_form_headers = {'content-type': 'application/x-www-form-urlencoded'}
    post_req = request.Request(
        RECAPTCHA_API_URL,
        data=post_form_data.encode(),
        headers=post_form_headers,
        method='POST')
    with request.urlopen(post_req) as res:
        recaptcha_check = json.loads(res.read())
        success = recaptcha_check['success']
        score = recaptcha_check['score']
        checked_hostname = recaptcha_check['hostname']
        if success and hostname == checked_hostname and score > 0.6:
            message = "\n".join([
                "[メールアドレス]" + data["email"],
                "[本文]",
                str(score),
                data["body"],
            ])
            r = send_email(SRC_MAIL, DST_MAIL, subject, message)
            return r
        else:
            return {
                'statusCode': 400,
                'body': "Bad Request"
            }
