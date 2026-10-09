<?php
/* =====================================================================
   OCORRÊNCIAS (focos de incêndio)
   POST  api/ocorrencias.php → o Raspberry Pi grava um foco detectado
         cabeçalho X-Chave + JSON {lat, lon, confianca, descricao, voo_id}
   GET   api/ocorrencias.php → últimas 20 ocorrências
   ===================================================================== */
require __DIR__ . '/conexao.php';
$pdo = banco();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $d = corpoJson();
  exigirChave($d);
  $lat = numero($d['lat'] ?? null);
  $lon = numero($d['lon'] ?? null);
  $conf = numero($d['confianca'] ?? null);
  if ($lat === null || $lon === null || $conf === null) responder(['ok' => false, 'erro' => 'lat, lon e confianca são obrigatórios.'], 400);

  $st = $pdo->prepare('INSERT INTO ocorrencias (voo_id, lat, lon, confianca, descricao) VALUES (?, ?, ?, ?, ?)');
  $st->execute([numero($d['voo_id'] ?? null), $lat, $lon, max(0, min(100, (int) $conf)),
                texto($d['descricao'] ?? null, 255)]);
  responder(['ok' => true, 'id' => (int) $pdo->lastInsertId()]);
}

$lista = $pdo->query('SELECT id, voo_id, lat, lon, confianca, descricao, situacao, criado_em FROM ocorrencias ORDER BY criado_em DESC LIMIT 20')->fetchAll();
responder(['ok' => true, 'lista' => $lista]);
