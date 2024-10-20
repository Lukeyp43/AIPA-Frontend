## What is AIPA? 

AIPA (Artificial Intelligence Physician Assistant) is a voice-activated interface that allows easy data collection from physician patients. 

* Visually appealing UI.
* Automatically sends reports to doctor on duty.
* Hands-free interface beneficial for those with limited mobility

## Why AIPA?

According to the AAPA[1], the US could face a shortage of up to **100k physicians** by 2030. To keep up with the demand of patients in America, we created AIPA. AIPA leverages speech-to-text and text-to-speech technology to streamline medical appointments, saving time for both physicians and patients.

## Project Technology

**React** - handles the dynamic web application

**Groq** - creates conversation bot and formats output to doctor

**Deepgram** - processes speech input and produces speech output from generated text

**LangChain** - meshes DeepGram and Groq in the backend

**Websockets + FastAPI** - connects backend to frontend and vice versa

## Sources

[1]  https://www.aapa.org/news-central/2017/03/aamc-releases-2017-projections-report/