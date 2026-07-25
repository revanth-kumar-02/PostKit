# PostKit — AI API Integration

## Providers

### Groq Cloud API

- **Endpoint**: `https://api.groq.com/openai/v1/chat/completions`
- **Auth**: API key via `VITE_GROQ_API_KEY` environment variable
- **Models**: Llama, Mixtral, Gemma (select based on task)
- **Use case**: Fast cloud inference, primary provider

### Ollama (Local)

- **Endpoint**: `http://localhost:11434/api/generate`
- **Auth**: None (local)
- **Models**: Any pulled model (e.g., `llama3`, `mistral`, `gemma2`)
- **Use case**: Offline/private inference, no API key needed

## Integration Notes

- All AI calls route through the background service worker
- Responses are streamed back to the side panel via Chrome messaging
- Provider selection is a user setting stored in Chrome Storage
