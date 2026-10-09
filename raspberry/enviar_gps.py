#!/usr/bin/env python3
"""
=====================================================================
 GuardFlame — lê o GPS e os dados de voo da Pixhawk (MAVLink) e envia
 para o banco de dados do site (api/telemetria.php).

 Instalar:        python3 -m venv ~/gf && ~/gf/bin/pip install pymavlink requests
 Rodar:           ~/gf/bin/python enviar_gps.py
 Teste sem drone: ~/gf/bin/python enviar_gps.py --simular
 Passo a passo completo: página Conexão › GPS do site.
=====================================================================
"""
import argparse
import math
import time

import requests

# ------------------------- EDITE AQUI -------------------------
SITE_API = "https://SEU-SITE.com/api/"   # pasta api/ do site (no XAMPP: "http://IP-DO-PC/guardflame/api/")
CHAVE = "troque-esta-chave"              # a mesma CHAVE_API do api/conexao.php
PORTA = "/dev/ttyACM0"                   # cabo USB da Pixhawk · pela TELEM2: "/dev/serial0"
BAUD = 115200                            # USB: 115200 · TELEM2: 57600
INTERVALO = 1.0                          # segundos entre um envio e outro
# --------------------------------------------------------------


def enviar(dados):
    """Grava uma posição no banco. Retorna True se deu certo."""
    try:
        r = requests.post(SITE_API.rstrip("/") + "/telemetria.php", json=dados,
                          headers={"X-Chave": CHAVE}, timeout=5)
        if r.status_code != 200:
            print("O site respondeu", r.status_code, "-", r.text[:200])
        return r.ok
    except requests.RequestException as e:
        print("Sem conexão com o site:", e)
        return False


def mostrar(d, ok):
    print(f"{'enviado' if ok else 'FALHOU '}  lat {d['lat']:.6f}  lon {d['lon']:.6f}  "
          f"alt {d['altitude']} m  vel {d['velocidade']} km/h  bat {d['bateria']}%  sat {d['satelites']}  {d['status']}")


def simular():
    """Voa em círculo perto de São Paulo, sem precisar do drone."""
    print("Modo simulado: enviando posições falsas para", SITE_API)
    lat0, lon0, t, bat = -23.5505, -46.6333, 0, 100.0
    while True:
        d = {"lat": round(lat0 + 0.002 * math.sin(t / 20), 7), "lon": round(lon0 + 0.002 * math.cos(t / 20), 7),
             "altitude": 60, "velocidade": 8, "bateria": int(bat), "satelites": 10, "status": "Simulação"}
        mostrar(d, enviar(d))
        t += 1
        bat = max(10, bat - 0.05)
        time.sleep(INTERVALO)


def pixhawk():
    from pymavlink import mavutil

    print("Conectando à Pixhawk em", PORTA, "...")
    m = mavutil.mavlink_connection(PORTA, baud=BAUD)
    m.wait_heartbeat()
    print("Pixhawk conectada (sistema", m.target_system, ")")
    # pede para a Pixhawk mandar os dados 4 vezes por segundo
    m.mav.request_data_stream_send(m.target_system, m.target_component,
                                   mavutil.mavlink.MAV_DATA_STREAM_ALL, 4, 1)

    d = {"lat": 0.0, "lon": 0.0, "altitude": 0, "velocidade": 0, "bateria": None, "satelites": None, "status": "Em solo"}
    tem_fix = False
    ultimo_envio = 0.0
    while True:
        msg = m.recv_match(type=["GLOBAL_POSITION_INT", "GPS_RAW_INT", "VFR_HUD", "SYS_STATUS", "HEARTBEAT"],
                           blocking=True, timeout=2)
        if msg is not None:
            tipo = msg.get_type()
            if tipo == "GLOBAL_POSITION_INT":
                d["lat"], d["lon"] = msg.lat / 1e7, msg.lon / 1e7
                d["altitude"] = round(msg.relative_alt / 1000, 1)          # metros acima da decolagem
            elif tipo == "GPS_RAW_INT":
                d["satelites"] = msg.satellites_visible
                tem_fix = msg.fix_type >= 3                                  # 3 = posição 3D
            elif tipo == "VFR_HUD":
                d["velocidade"] = round(msg.groundspeed * 3.6, 1)          # m/s → km/h
            elif tipo == "SYS_STATUS" and msg.battery_remaining >= 0:
                d["bateria"] = msg.battery_remaining
            elif tipo == "HEARTBEAT" and msg.autopilot != mavutil.mavlink.MAV_AUTOPILOT_INVALID:
                armado = msg.base_mode & mavutil.mavlink.MAV_MODE_FLAG_SAFETY_ARMED
                d["status"] = "Em voo" if armado else "Em solo"

        if time.time() - ultimo_envio >= INTERVALO:
            ultimo_envio = time.time()
            if tem_fix and (d["lat"] or d["lon"]):
                mostrar(d, enviar(d))
            else:
                print("Esperando o GPS achar os satélites... (satélites:", d["satelites"], ")")


if __name__ == "__main__":
    p = argparse.ArgumentParser(description="Envia o GPS do drone para o site GuardFlame")
    p.add_argument("--simular", action="store_true", help="envia posições falsas (teste sem o drone)")
    args = p.parse_args()
    if "SEU-SITE" in SITE_API or CHAVE == "troque-esta-chave":
        print("Edite SITE_API e CHAVE no topo deste arquivo antes de rodar.")
        raise SystemExit(1)
    try:
        simular() if args.simular else pixhawk()
    except KeyboardInterrupt:
        print("\nParado.")
