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

```json
{
    "messages": [
        {"role": "system", "content": "You will be provided with a sentence in English, and your task is to translate it into Japanese."},
        {"role": "user", "content": "My name is Fadli. What is yours?"}
    ]
}
```

#### Response

The implementation might be different since I need tto integrate it from front-end side to make it clearer.

```json
{
    "success": true,
    "message": {
        "index": 0,
        "message": {
            "role": "assistant",
            "content": "私の名前はファドリです。あなたの名前は何ですか？ (Watashi no namae wa Fadli desu. Anata no namae wa nan desu ka?)"
        },
        "finish_reason": "stop"
    }
}
```

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