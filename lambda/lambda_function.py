import boto3
import json
from urllib import request, parse
import os
import re

SRC_MAIL = "tannakaken@gmail.com"
DST_MAIL = "ebizosui2017wishrimp@gmail.com"
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


def request_type(type):
    if type == "MV":
        return "MV"
    elif type == "TV":
        return "TVアニメ"
    elif type == "Illustration":
        return "イラスト"
    elif type == "Manga":
        return "マンガ"
    else:
        return "その他"


def request_detail(detail):
    if detail == "CharacterDesign":
        return "キャラクターデザイン"
    elif detail == "KeyAnimation":
        return "原画"
    elif detail == "SecondKeyAnimation":
        return "第二原画"
    elif detail == "BetweenAnimation":
        return "動画"
    elif detail == "CleanUp":
        return "仕上げ"
    else:
        return "その他"


def request_details(details):
    return ",".join([request_detail(detail) for detail in details])


def lambda_handler(event, context):
    if event["requestContext"]["http"]["method"] == "OPTIONS":
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
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
        score = recaptcha_check.get('score', 0)
        checked_hostname = recaptcha_check.get('hostname')
        if success and hostname == checked_hostname and score > 0.6:
            message = "\n".join([
                "[メールアドレス]" + data["email"],
                "[お名前]" + data["name"],
                "[お仕事内容]" + request_type(data["requestType"]),
                "[詳細]" + request_details(data["details"]),
                "[本文]",
                data["body"],
            ])
            r = send_email(SRC_MAIL, DST_MAIL, subject, message)
            return r
        else:
            return {
                'statusCode': 400,
                'body': "Bad Request"
            }
