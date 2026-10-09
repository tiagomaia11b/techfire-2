<?php
/* =====================================================================
   STATUS — a página Banco de dados usa para testar a conexão
   GET api/status.php
   ===================================================================== */
require __DIR__ . '/conexao.php';

$r = ['ok' => true, 'php' => PHP_VERSION, 'mysql' => false, 'banco' => false, 'nomeBanco' => DB_NOME,
      'tabelas' => [], 'chavePadrao' => CHAVE_API === 'troque-esta-chave'];

try {
  $pdo = new PDO('mysql:host=' . DB_HOST . ';charset=utf8mb4', DB_USUARIO, DB_SENHA, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
  $r['mysql'] = true;
  $pdo->exec('USE `' . str_replace('`', '', DB_NOME) . '`');
  $r['banco'] = true;
} catch (PDOException $e) {
  $r['erro'] = $e->getMessage();
  responder($r);
}

foreach (['usuarios', 'voos', 'telemetria', 'ocorrencias'] as $t) {
  try { $r['tabelas'][$t] = (int) $pdo->query("SELECT COUNT(*) FROM $t")->fetchColumn(); }
  catch (PDOException $e) { $r['tabelas'][$t] = null; }
}
responder($r);
