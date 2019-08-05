const AWS = require('aws-sdk')
const translate = new AWS.Translate({ apiVersion: '2017-07-01' })
const comprehend = new AWS.Comprehend({ apiVersion: '2017-11-27' })
/*

- make sure your lambda has a role that is permitted to call Translate and Comprehend
- when integrated with API Gateway, the request body would be in event.body
- for simplicity this example assumes that you are calling directly from the test console
- Translate's TargetLanguageCode is set to english
*/

/*
example test event:
{
    "text": "susah sangat nak guna app dia ni"
}
*/

exports.handler = async (event) => {
    const translateParams = {
        SourceLanguageCode: 'auto',
        Text: event.text,
        TargetLanguageCode: 'en'
    }
    const translateResult = await translate.translateText(translateParams).promise()
    const comprehendParams = {
        LanguageCode: 'en',
        Text: translateResult.TranslatedText
    }
    const comprehendResult = await comprehend.detectSentiment(comprehendParams).promise()
    return { translateResult, comprehendResult }
};