#!/bin/bash
# =====================================================================
#  GuardFlame — transmite a câmera Arducam do Raspberry Pi para a Twitch
#  Uso:   chmod +x transmitir_twitch.sh   (só na primeira vez)
#         ./transmitir_twitch.sh
#  Passo a passo completo: página Conexão › Câmera do site.
# =====================================================================

# Chave de transmissão da Twitch
# (Painel do criador › Configurações › Transmissão › Chave de transmissão principal)
# NUNCA publique essa chave no site ou no GitHub — coloque só na cópia que fica no Pi.
CHAVE_TWITCH="COLE_SUA_CHAVE_AQUI"

# Servidor de entrada da Twitch
SERVIDOR="rtmp://live.twitch.tv/app"

# Qualidade (720p a 2,5 Mbps é bom para 4G; se travar, use BITRATE=1500000)
LARGURA=1280
ALTURA=720
FPS=30
BITRATE=2500000

# Áudio: "silencio" (sem som) ou "microfone" (microfone USB do drone)
AUDIO="silencio"
MIC="plughw:1,0"     # descubra o seu com:  arecord -l   (placa X, dispositivo Y → plughw:X,Y)

# ---------------------------------------------------------------------
# Daqui para baixo não precisa mexer
# ---------------------------------------------------------------------
if [ "$CHAVE_TWITCH" = "COLE_SUA_CHAVE_AQUI" ]; then
  echo "Coloque sua chave da Twitch na linha CHAVE_TWITCH deste arquivo."; exit 1
fi

# rpicam-vid (Raspberry Pi OS Bookworm) ou libcamera-vid (versões antigas)
CAM=$(command -v rpicam-vid || command -v libcamera-vid)
if [ -z "$CAM" ]; then echo "Câmera: instale com  sudo apt install -y rpicam-apps"; exit 1; fi
command -v ffmpeg >/dev/null || { echo "Instale o ffmpeg:  sudo apt install -y ffmpeg"; exit 1; }

if [ "$AUDIO" = "microfone" ]; then
  ENTRADA_AUDIO=(-thread_queue_size 1024 -f alsa -ac 1 -i "$MIC")
else
  ENTRADA_AUDIO=(-f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100)
fi

echo "Transmitindo para a Twitch... (Ctrl+C para parar)"
while true; do
  "$CAM" -t 0 --nopreview --width "$LARGURA" --height "$ALTURA" --framerate "$FPS" \
      --codec h264 --profile high --level 4.1 --inline --intra $((FPS * 2)) \
      --bitrate "$BITRATE" -o - \
  | ffmpeg -hide_banner -loglevel warning \
      -thread_queue_size 1024 -use_wallclock_as_timestamps 1 -f h264 -framerate "$FPS" -i - \
      "${ENTRADA_AUDIO[@]}" \
      -map 0:v -map 1:a -c:v copy -c:a aac -b:a 128k -ar 44100 \
      -f flv "$SERVIDOR/$CHAVE_TWITCH"
  echo "A transmissão caiu (sinal do 4G?). Tentando de novo em 5 segundos..."
  sleep 5
done
