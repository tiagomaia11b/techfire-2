<?php
/* =====================================================================
   TELEMETRIA (GPS)
   POST  api/telemetria.php          → o Raspberry Pi grava uma posição
         cabeçalho X-Chave + JSON {lat, lon, altitude, velocidade, bateria, satelites, status, voo_id}
   GET   api/telemetria.php          → última posição (com "idade" em segundos)
   GET   api/telemetria.php?lista=50 → últimas 50 posições (trajeto)
   ===================================================================== */
require __DIR__ . '/conexao.php';
$pdo = banco();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $d = corpoJson();
  exigirChave($d);
  $lat = numero($d['lat'] ?? null);
  $lon = numero($d['lon'] ?? null);
  if ($lat === null || $lon === null || abs($lat) > 90 || abs($lon) > 180) responder(['ok' => false, 'erro' => 'lat e lon são obrigatórios.'], 400);

  $st = $pdo->prepare('INSERT INTO telemetria (voo_id, lat, lon, altitude, velocidade, bateria, satelites, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  $st->execute([
    numero($d['voo_id'] ?? null), $lat, $lon,
    numero($d['altitude'] ?? null), numero($d['velocidade'] ?? null),
    numero($d['bateria'] ?? null), numero($d['satelites'] ?? null),
    texto($d['status'] ?? null, 30)
  ]);
  responder(['ok' => true, 'id' => (int) $pdo->lastInsertId()]);
}

if (isset($_GET['lista'])) {
  $n = max(1, min(1000, (int) $_GET['lista']));
  $lista = $pdo->query("SELECT id, voo_id, lat, lon, altitude, velocidade, bateria, satelites, status, criado_em FROM telemetria ORDER BY id DESC LIMIT $n")->fetchAll();
  responder(['ok' => true, 'lista' => $lista]);
}

$ultimo = $pdo->query('SELECT *, TIMESTAMPDIFF(SECOND, criado_em, NOW()) AS idade FROM telemetria ORDER BY id DESC LIMIT 1')->fetch();
responder(['ok' => true, 'ultimo' => $ultimo ?: null]);
