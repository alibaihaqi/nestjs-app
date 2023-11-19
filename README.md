# Nest App

## Application

TBD

## Open AI

For current features, there're 3 different implementations with Open AI:
- Chat Generation (like what we used with **ChatGPT** but not yet **stream**)
- Text to Audio (Use OpenAI to generate audio file from the text)
- Transcriptions (Use Open AI to change from audio/video file into text (**currently only support data already uploaded to the cloud**))


### Chat Generation

#### Request

TBD

#### Response

TBD

### Text to Audio

#### Request
```json
{
    "input": "Hello Everyone! My name is Fadli. Thank you",
    "voice": "alloy" // or you can use other voice based on documentation, 'echo', 'fable', 'onyx', 'nova', 'shimmer'
}
```

#### Response
```json
{
    "success": true,
    "assetPath": "<AUDIO_PATH>/audio-name.mp3",
    "name": "audio-name.mp3"
}
```

### Transcriptions

#### Request
```json
{
    "assetPath": "<AUDIO_PATH>/audio-name.mp3"
}
```

#### Response
```json
{
    "success": true,
    "text": "Hello Everyone! My name is Fadli. Thank you"
}
```

## License
Nest is [MIT licensed](LICENSE).