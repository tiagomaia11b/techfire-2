/* =====================================================================
   PÁGINA REFERÊNCIAS (referencias.html)
   [autor, título, link (opcional)] — formato ABNT NBR 6023
   ===================================================================== */
const REFS = [
  { cat: "Drones e tecnologia UAV", icon: "drone", itens: [
    ["VALAVANIS, K. P.; VACHTSEVANOS, G. J. (org.).", "Handbook of Unmanned Aerial Vehicles. Dordrecht: Springer, 2015.", ""],
    ["YUAN, C.; ZHANG, Y.; LIU, Z.", "A survey on technologies for automatic forest fire monitoring, detection, and fighting using unmanned aerial vehicles and remote sensing techniques. Canadian Journal of Forest Research, v. 45, n. 7, 2015.", ""]
  ]},
  { cat: "Pixhawk e controle de voo", icon: "chip", itens: [
    ["ARDUPILOT.", "ArduPilot Copter Documentation.", "https://ardupilot.org/copter/"],
    ["PX4.", "PX4 Autopilot User Guide.", "https://docs.px4.io/"]
  ]},
  { cat: "Raspberry Pi e câmera", icon: "eye", itens: [
    ["UPTON, E.; HALFACREE, G.", "Raspberry Pi: manual do usuário. São Paulo: Novatec, 2013.", ""],
    ["RASPBERRY PI LTD.", "Camera software documentation.", "https://www.raspberrypi.com/documentation/computers/camera_software.html"],
    ["ARDUCAM.", "12MP IMX708 Camera Module documentation.", "https://docs.arducam.com/Raspberry-Pi-Camera/Native-camera/12MP-IMX708/"]
  ]},
  { cat: "Visão computacional", icon: "eye", itens: [
    ["OPENCV.", "OpenCV Documentation.", "https://docs.opencv.org/"],
    ["ALLISON, R. S. et al.", "Airborne optical and thermal remote sensing for wildfire detection and monitoring. Sensors, v. 16, n. 8, 2016.", ""]
  ]},
  { cat: "Sistemas GPS", icon: "pin", itens: [
    ["KAPLAN, E. D.; HEGARTY, C. J.", "Understanding GPS/GNSS: principles and applications. 3. ed. Boston: Artech House, 2017.", ""]
  ]},
  { cat: "Áudio e reconhecimento de voz", icon: "mic", itens: [
    ["ADAFRUIT.", "Adafruit MAX98357 I2S Class-D Mono Amp.", "https://learn.adafruit.com/adafruit-max98357-i2s-class-d-mono-amp"],
    ["ELECHOUSE.", "Voice Recognition Module V3 – manual.", "https://www.elechouse.com/product/speak-recognition-voice-recognition-module-v3/"]
  ]},
  { cat: "Monitoramento ambiental", icon: "tree", itens: [
    ["INPE – Instituto Nacional de Pesquisas Espaciais.", "Programa Queimadas: monitoramento de focos.", "https://terrabrasilis.dpi.inpe.br/queimadas/portal/"]
  ]},
  { cat: "MySQL e banco de dados", icon: "db", itens: [
    ["MILANI, A.", "MySQL: guia do programador. São Paulo: Novatec, 2006.", ""],
    ["ORACLE.", "MySQL Reference Manual.", "https://dev.mysql.com/doc/"]
  ]},
  { cat: "Transmissão, GPS e site", icon: "radio", itens: [
    ["TWITCH.", "Twitch Embed: documentação para desenvolvedores.", "https://dev.twitch.tv/docs/embed/"],
    ["FFMPEG.", "FFmpeg Documentation.", "https://ffmpeg.org/documentation.html"],
    ["ARDUPILOT.", "MAVLink Basics (Dev Documentation).", "https://ardupilot.org/dev/docs/mavlink-basics.html"],
    ["THE PHP GROUP.", "Manual do PHP.", "https://www.php.net/manual/pt_BR/"],
    ["LEAFLET.", "Leaflet API Reference.", "https://leafletjs.com/reference.html"]
  ]}
];

iniciarPagina("referencias", () => {
  $("#refList").innerHTML = REFS.map(g => `
    <div class="ref-group"><h3><span class="ic">${icon(g.icon)}</span>${g.cat}<span class="tag">${g.itens.length}</span></h3>
      <div class="grid g2">${g.itens.map(([a, t, url]) => `<div class="card ref"><span class="who">${a}</span> ${t}${url ? `<br><a href="${url}" target="_blank" rel="noopener">Acessar fonte</a>` : ""}</div>`).join("")}</div></div>`).join("") +
    `<p class="muted" style="font-size:.88rem">Referências organizadas conforme a ABNT NBR 6023.</p>`;
});
