const dados = JSON.parse(open("../../data/values.json"));

let assessoria = dados.importacaoAcionamento.assessoria
assessoria = Number(assessoria)

export const layouts = {
  //layout 1
  //sem inc
  l1_ok: `
    COPY (
        SELECT '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}01' || '0000000001'
        UNION ALL
        (
            SELECT
                '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
                to_char(now(), 'YYYYMMDDHH24:MI:SS') || '012' ||
                to_char(current_date + 3, 'YYYYMMDD') ||
                rpad('Gabriel Mauricio', 50, ' ') || 'acionado'
            FROM devedor d
            WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
            ORDER BY random() LIMIT 3
        )
        UNION ALL
        (
            SELECT '999000003000000000000000003000000000000000000000000000000'
        )
    ) TO STDOUT;
  `,
  l1_1inc: `
    COPY (
    SELECT '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}01' || '0000000001'
        union all(
          SELECT
                '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
                to_char(now(), 'YYYYMMDDHH24:MI:SS') || '012' ||
                to_char(current_date + 3, 'YYYYMMDD') ||
                rpad('', 50, ' ') || 'acionado'
            FROM devedor d
            WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
            ORDER BY random() LIMIT 1
        )
        UNION ALL
        (
            SELECT
                '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
                to_char(now(), 'YYYYMMDDHH24:MI:SS') || '012' ||
                to_char(current_date + 3, 'YYYYMMDD') ||
                rpad('Gabriel Mauricio', 50, ' ') || 'acionado'
            FROM devedor d
            WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
            ORDER BY random() LIMIT 2
        )
        UNION ALL
        (
            SELECT '999000003000000000000000003000000000000000000000000000000'
        )
    ) TO STDOUT;
  `,
  l1_all_inc: `
  COPY(    WITH parametros AS (
    SELECT 
        now() AS data_atual,
        to_char(now(), 'DDMMYYYYHHMMSS') AS data_cabecalho,
        to_char(current_date + 3, 'YYYYMMDD') AS data_vencimento,
        'Gabriel Mauricio' AS nome,
        'acionado' AS status,
        1 AS empresa_alvo,
        ${assessoria} AS carteira_alvo
),
base_devedor AS (
    SELECT 
        d.devid,
        d.devempcod,
        p.data_atual,
        p.data_cabecalho,
        p.data_vencimento,
        p.nome,
        p.status
    FROM devedor d, parametros p
    WHERE d.devati = 0 AND d.devsal > 50 AND d.devempcod = p.empresa_alvo AND d.carcod = p.carteira_alvo
    ORDER BY random() LIMIT 10
),
registros AS (
    SELECT '000' || data_cabecalho || '00${assessoria}01' || '0000000001' AS linha
    FROM parametros
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad('2', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') || status
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
           rpad('', 16, ' ') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') || status
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
           to_char(data_atual + interval '1 day', 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') || status
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad('', 50, ' ') || status
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '000' ||
           data_vencimento || rpad(nome, 50, ' ') || status
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad('', 20, ' ') || rpad(devempcod::text, 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') || status
    FROM base_devedor LIMIT 1)
    UNION ALL
    SELECT '999000003000000000000000003000000000000000000000000000000'
)
SELECT * FROM registros) TO STDOUT;
  `,
  l1_same_dev: `
    COPY (
WITH primeiro AS (
  SELECT devid, devempcod
  FROM devedor d
  WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
  ORDER BY random()
  LIMIT 1
),
restantes AS (
  SELECT devid, devempcod
  FROM devedor d
  WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
  ORDER BY random()
  LIMIT 2
)
SELECT
  '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}01' || '0000000001'
UNION ALL
SELECT
  '4001' ||
  rpad(devid, 20, ' ') ||
  rpad(devempcod::text, 20, ' ') ||
  to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
  '012' ||
  to_char(current_date + 3, 'YYYYMMDD') ||
  rpad('GABRIEL MAURICIO', 50, ' ') ||
  'acionado'
FROM primeiro
UNION ALL
SELECT
   '4001' ||
  rpad(devid, 20, ' ') ||
  rpad(devempcod::text, 20, ' ') ||
  to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
  '012' ||
  to_char(current_date + 3, 'YYYYMMDD') ||
  rpad('GABRIEL MAURICIO', 50, ' ') ||
  'acionado'
FROM primeiro
UNION ALL
SELECT
    '4001' ||
  rpad(devid, 20, ' ') ||
  rpad(devempcod::text, 20, ' ') ||
  to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
  '012' ||
  to_char(current_date + 3, 'YYYYMMDD') ||
  rpad('GABRIEL MAURICIO', 50, ' ') ||
  'acionado'
FROM restantes
UNION ALL
        (
            SELECT '999000003000000000000000003000000000000000000000000000000'
        )
    ) TO STDOUT;
  `,
  l1_dist_dev: `
    COPY (
        SELECT '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}01' || '0000000001'
        UNION ALL
        (
            SELECT
                '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
                to_char(now(), 'YYYYMMDDHH24:MI:SS') || '012' ||
                to_char(current_date + 3, 'YYYYMMDD') ||
                rpad('Gabriel Mauricio', 50, ' ') || 'acionado'
            FROM devedor d
            WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = 58
            ORDER BY random() LIMIT 1
        ) Union all 
        (
            SELECT
                '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
                to_char(now(), 'YYYYMMDDHH24:MI:SS') || '012' ||
                to_char(current_date + 3, 'YYYYMMDD') ||
                rpad('Gabriel Mauricio', 50, ' ') || 'acionado'
            FROM devedor d
            WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
            ORDER BY random() LIMIT 2
        )
        UNION ALL
        (
            SELECT '999000003000000000000000003000000000000000000000000000000'
        )
    ) TO STDOUT;
  `,

  // Com inconsistências tratadas
  l1_ok_fix: `
    COPY (
        SELECT '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}01' || '0000000001'
        UNION ALL
        (
            SELECT
                '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
                to_char(now(), 'YYYYMMDDHH24:MI:SS') || '012' ||
                to_char(current_date + 3, 'YYYYMMDD') ||
                rpad('Gabriel Mauricio', 50, ' ') || 'acionado'
            FROM devedor d
            WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
            ORDER BY random() LIMIT 3
        )
        UNION ALL
        (
            SELECT '999000003000000000000000003000000000000000000000000000000'
        )
    ) TO STDOUT;
  `,
  l1_1inc_fix: `
    COPY (
    SELECT '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}01' || '0000000001'
        union all(
          SELECT
                '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
                to_char(now(), 'YYYYMMDDHH24:MI:SS') || '012' ||
                to_char(current_date + 3, 'YYYYMMDD') ||
                rpad('', 50, ' ') || 'acionado'
            FROM devedor d
            WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
            ORDER BY random() LIMIT 1
        )
        UNION ALL
        (
            SELECT
                '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
                to_char(now(), 'YYYYMMDDHH24:MI:SS') || '012' ||
                to_char(current_date + 3, 'YYYYMMDD') ||
                rpad('Gabriel Mauricio', 50, ' ') || 'acionado'
            FROM devedor d
            WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
            ORDER BY random() LIMIT 2
        )
        UNION ALL
        (
            SELECT '999000003000000000000000003000000000000000000000000000000'
        )
    ) TO STDOUT;
  `,
  l1_all_inc_fix: `
   COPY(    WITH parametros AS (
    SELECT 
        now() AS data_atual,
        to_char(now(), 'DDMMYYYYHHMMSS') AS data_cabecalho,
        to_char(current_date + 3, 'YYYYMMDD') AS data_vencimento,
        'Gabriel Mauricio' AS nome,
        'acionado' AS status,
        1 AS empresa_alvo,
        ${assessoria} AS carteira_alvo
),
base_devedor AS (
    SELECT 
        d.devid,
        d.devempcod,
        p.data_atual,
        p.data_cabecalho,
        p.data_vencimento,
        p.nome,
        p.status
    FROM devedor d, parametros p
    WHERE d.devati = 0 AND d.devsal > 50 AND d.devempcod = p.empresa_alvo AND d.carcod = p.carteira_alvo
    ORDER BY random() LIMIT 10
),
registros AS (
    SELECT '000' || data_cabecalho || '00${assessoria}01' || '0000000001' AS linha
    FROM parametros
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad('2', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') || status
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
           rpad('', 16, ' ') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') || status
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
           to_char(data_atual + interval '1 day', 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') || status
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad('', 50, ' ') || status
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '000' ||
           data_vencimento || rpad(nome, 50, ' ') || status
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad('', 20, ' ') || rpad(devempcod::text, 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') || status
    FROM base_devedor LIMIT 1)
    UNION ALL
    SELECT '999000003000000000000000003000000000000000000000000000000'
)
SELECT * FROM registros) TO STDOUT;
  `,
  l1_same_dev_fix: ` 
    COPY (
WITH primeiro AS (
  SELECT devid, devempcod
  FROM devedor d
  WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
  ORDER BY random()
  LIMIT 1
),
restantes AS (
  SELECT devid, devempcod
  FROM devedor d
  WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
  ORDER BY random()
  LIMIT 2
)
SELECT
  '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}01' || '0000000001'
UNION ALL
SELECT
  '4001' ||
  rpad(devid, 20, ' ') ||
  rpad(devempcod::text, 20, ' ') ||
  to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
  '012' ||
  to_char(current_date + 3, 'YYYYMMDD') ||
  rpad('GABRIEL MAURICIO', 50, ' ') ||
  'acionado'
FROM primeiro
UNION ALL
SELECT
   '4001' ||
  rpad(devid, 20, ' ') ||
  rpad(devempcod::text, 20, ' ') ||
  to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
  '012' ||
  to_char(current_date + 3, 'YYYYMMDD') ||
  rpad('GABRIEL MAURICIO', 50, ' ') ||
  'acionado'
FROM primeiro
UNION ALL
SELECT
    '4001' ||
  rpad(devid, 20, ' ') ||
  rpad(devempcod::text, 20, ' ') ||
  to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
  '012' ||
  to_char(current_date + 3, 'YYYYMMDD') ||
  rpad('GABRIEL MAURICIO', 50, ' ') ||
  'acionado'
FROM restantes
UNION ALL
        (
            SELECT '999000003000000000000000003000000000000000000000000000000'
        )
    ) TO STDOUT;
  `,
  l1_dist_dev_fix: `
     COPY (
        SELECT '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}01' || '0000000001'
        UNION ALL
        (
            SELECT
                '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
                to_char(now(), 'YYYYMMDDHH24:MI:SS') || '012' ||
                to_char(current_date + 3, 'YYYYMMDD') ||
                rpad('Gabriel Mauricio', 50, ' ') || 'acionado'
            FROM devedor d
            WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = 58
            ORDER BY random() LIMIT 1
        ) Union all 
        (
            SELECT
                '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
                to_char(now(), 'YYYYMMDDHH24:MI:SS') || '012' ||
                to_char(current_date + 3, 'YYYYMMDD') ||
                rpad('Gabriel Mauricio', 50, ' ') || 'acionado'
            FROM devedor d
            WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
            ORDER BY random() LIMIT 2
        )
        UNION ALL
        (
            SELECT '999000003000000000000000003000000000000000000000000000000'
        )
    ) TO STDOUT;
  `,
  //layout 2
  //sem inc
  l2_ok: `
    COPY (
        SELECT '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}02' || '0000000001'
        UNION ALL
        (
            SELECT
                '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
                to_char(now(), 'YYYYMMDDHH24:MI:SS') || '012' ||
                to_char(current_date + 3, 'YYYYMMDD') ||
                rpad('Gabriel Mauricio', 50, ' ') ||
                rpad('47992353808',15,' ') || 
                rpad('',70,' ') 
                || 'acionado'
            FROM devedor d
            WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
            ORDER BY random() LIMIT 3
        )
        UNION ALL
        (
            SELECT '999000003000000000000000003000000000000000000000000000000'
        )
    ) TO STDOUT;
  `,
  l2_1inc: `
    COPY (
       SELECT '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}02' || '0000000001'
UNION ALL
(
    SELECT
        '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
        to_char(now(), 'YYYYMMDDHH24:MI:SS') || '012' ||
        to_char(current_date + 3, 'YYYYMMDD') ||
        rpad('Gabriel Mauricio', 50, ' ') ||
        rpad('',15,' ') || 
        rpad('',70,' ') 
        || 'acionado'
    FROM devedor d
    WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
    ORDER BY random() LIMIT 1
)
UNION ALL
(
    SELECT
        '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
        to_char(now(), 'YYYYMMDDHH24:MI:SS') || '012' ||
        to_char(current_date + 3, 'YYYYMMDD') ||
        rpad('Gabriel Mauricio', 50, ' ') ||
        rpad('47992353808',15,' ') || 
        rpad('',70,' ') 
        || 'acionado'
    FROM devedor d
    WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
    ORDER BY random() LIMIT 2
)
UNION ALL
(
    SELECT '999000003000000000000000003000000000000000000000000000000'
)
    ) TO STDOUT;
  `,
  l2_all_inc: `
       COPY( WITH parametros AS (
    SELECT 
        now() AS data_atual,
        to_char(now(), 'DDMMYYYYHHMMSS') AS data_cabecalho,
        to_char(current_date + 3, 'YYYYMMDD') AS data_vencimento,
        'Gabriel Mauricio' AS nome,
        'acionado' AS status,
        1 AS empresa_alvo,
        ${assessoria} AS carteira_alvo
),
base_devedor AS (
    SELECT 
        d.devid,
        d.devempcod,
        p.data_atual,
        p.data_cabecalho,
        p.data_vencimento,
        p.nome,
        p.status
    FROM devedor d, parametros p
    WHERE d.devati = 0 AND d.devsal > 50 AND d.devempcod = p.empresa_alvo AND d.carcod = p.carteira_alvo
    ORDER BY random() LIMIT 10
),
registros AS (
    SELECT '000' || data_cabecalho || '00${assessoria}02' || '0000000001' AS linha
    FROM parametros
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad('2', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||status 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad('1', 20, ' ') ||
           rpad('',16,' ') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||status 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad('1', 20, ' ') ||
           to_char(data_atual+interval '1 day', 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||status 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad('1', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad('', 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||status  
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad('1', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '000' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||status 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad('', 20, ' ') || rpad('1', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||status 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad('1', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') 
    FROM base_devedor LIMIT 1)
    UNION ALL
    SELECT '999000003000000000000000003000000000000000000000000000000'
)
SELECT * FROM registros)TO STDOUT;
  `,
  l2_same_dev: `
    COPY (
WITH primeiro AS (
  SELECT devid, devempcod
  FROM devedor d
  WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
  ORDER BY random()
  LIMIT 1
),
restantes AS (
  SELECT devid, devempcod
  FROM devedor d
  WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
  ORDER BY random()
  LIMIT 2
)
SELECT
  '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}02' || '0000000001'
UNION ALL
SELECT
    '4001' ||
  rpad(devid, 20, ' ') ||
  rpad(devempcod::text, 20, ' ') ||
  to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
  '012' ||
  to_char(current_date + 3, 'YYYYMMDD') ||
  rpad('GABRIEL MAURICIO', 50, ' ') ||
  rpad('47992353808',85,' ')||
  'acionado'
FROM primeiro
UNION ALL
SELECT
    '4001' ||
  rpad(devid, 20, ' ') ||
  rpad(devempcod::text, 20, ' ') ||
  to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
  '012' ||
  to_char(current_date + 3, 'YYYYMMDD') ||
  rpad('GABRIEL MAURICIO', 50, ' ') ||
  rpad('47992353808',85,' ')||
  'acionado'
FROM primeiro
UNION ALL
SELECT
    '4001' ||
  rpad(devid, 20, ' ') ||
  rpad(devempcod::text, 20, ' ') ||
  to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
  '012' ||
  to_char(current_date + 3, 'YYYYMMDD') ||
  rpad('GABRIEL MAURICIO', 50, ' ') ||
  rpad('47992353808',85,' ')||
  'acionado'
FROM restantes
UNION ALL
        (
            SELECT '999000003000000000000000003000000000000000000000000000000'
        )
    ) TO STDOUT;
  `,
  l2_same_tel_inv: `
    COPY (
WITH primeiro AS (
  SELECT devid, devempcod
  FROM devedor d
  WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
  ORDER BY random()
  LIMIT 1
),
restantes AS (
  SELECT devid, devempcod
  FROM devedor d
  WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
  ORDER BY random()
  LIMIT 2
)
SELECT
  '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}02' || '0000000001'
UNION ALL
SELECT
    '4001' ||
  rpad(devid, 20, ' ') ||
  rpad(devempcod::text, 20, ' ') ||
  to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
  '012' ||
  to_char(current_date + 3, 'YYYYMMDD') ||
  rpad('GABRIEL MAURICIO', 50, ' ') ||
  rpad('47992353808',85,' ')||
  'acionado'
FROM primeiro
UNION ALL
SELECT
    '4001' ||
  rpad(devid, 20, ' ') ||
  rpad(devempcod::text, 20, ' ') ||
  to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
  '012' ||
  to_char(current_date + 3, 'YYYYMMDD') ||
  rpad('GABRIEL MAURICIO', 50, ' ') ||
  rpad('4792353808',85,' ')||
  'acionado'
FROM primeiro
UNION ALL
        (
            SELECT '999000003000000000000000003000000000000000000000000000000'
        )
    ) TO STDOUT;
  `,
  l2_same_email_mix: `
    COPY (

    WITH primeiro AS (
      SELECT devid, devempcod
      FROM devedor d
      WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
      ORDER BY random()
      LIMIT 1
    ),
    restantes AS (
      SELECT devid, devempcod
      FROM devedor d
      WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
      ORDER BY random()
      LIMIT 2
    )
    SELECT
      '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}02' || '0000000001'
    UNION ALL(
    SELECT
        '4001' ||
      rpad(devid, 20, ' ') ||
      rpad(devempcod::text, 20, ' ') ||
      to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
      '012' ||
      to_char(current_date + 3, 'YYYYMMDD') ||
      rpad('GABRIEL MAURICIO', 50, ' ') ||
      rpad('',15,' ')||
      rpad('novoemailgmail.com',70,' ')||
      'acionado'
    FROM primeiro)
    UNION ALL(
    SELECT
        '4001' ||
      rpad(devid, 20, ' ') ||
      rpad(devempcod::text, 20, ' ') ||
      to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
      '012' ||
      to_char(current_date + 3, 'YYYYMMDD') ||
      rpad('GABRIEL MAURICIO', 50, ' ') ||
      rpad('',15,' ')||
      RPAD('novoemail@gmail.com',70,' ')||
      'acionado'
    FROM primeiro)
    UNION ALL
            (
                SELECT '999000003000000000000000003000000000000000000000000000000'
            )    
    ) TO STDOUT;
  `,
  l2_dist_dev: `
COPY (
        SELECT '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}02' || '0000000001'
        UNION ALL
        (
            SELECT
                '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
                to_char(now(), 'YYYYMMDDHH24:MI:SS') || '012' ||
                to_char(current_date + 3, 'YYYYMMDD') ||
                rpad('Gabriel Mauricio', 50, ' ') ||
                rpad('47992353808',85,' ')||
                'acionado'
            FROM devedor d
            WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = 58
            ORDER BY random() LIMIT 1
        ) Union all 
        (
            SELECT
                '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
                to_char(now(), 'YYYYMMDDHH24:MI:SS') || '012' ||
                to_char(current_date + 3, 'YYYYMMDD') ||
                rpad('Gabriel Mauricio', 50, ' ') ||
                rpad('47992353808',85,' ')||
                'acionado'
            FROM devedor d
            WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
            ORDER BY random() LIMIT 2
        )
        UNION ALL
        (
            SELECT '999000003000000000000000003000000000000000000000000000000'
        )
    ) TO STDOUT;
  `,

  // Com inconsistências tratadas
  l2_ok_fix: `
        COPY (
        SELECT '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}02' || '0000000001'
        UNION ALL
        (
            SELECT
                '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
                to_char(now(), 'YYYYMMDDHH24:MI:SS') || '012' ||
                to_char(current_date + 3, 'YYYYMMDD') ||
                rpad('Gabriel Mauricio', 50, ' ') ||
                rpad('47992353808',15,' ') || 
                rpad('',70,' ') 
                || 'acionado'
            FROM devedor d
            WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
            ORDER BY random() LIMIT 3
        )
        UNION ALL
        (
            SELECT '999000003000000000000000003000000000000000000000000000000'
        )
    ) TO STDOUT;
  `,
  l2_1inc_fix: `
    COPY (
       SELECT '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}02' || '0000000001'
UNION ALL
(
    SELECT
        '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
        to_char(now(), 'YYYYMMDDHH24:MI:SS') || '012' ||
        to_char(current_date + 3, 'YYYYMMDD') ||
        rpad('Gabriel Mauricio', 50, ' ') ||
        rpad('',15,' ') || 
        rpad('',70,' ') 
        || 'acionado'
    FROM devedor d
    WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
    ORDER BY random() LIMIT 1
)
UNION ALL
(
    SELECT
        '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
        to_char(now(), 'YYYYMMDDHH24:MI:SS') || '012' ||
        to_char(current_date + 3, 'YYYYMMDD') ||
        rpad('Gabriel Mauricio', 50, ' ') ||
        rpad('47992353808',15,' ') || 
        rpad('',70,' ') 
        || 'acionado'
    FROM devedor d
    WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
    ORDER BY random() LIMIT 2
)
UNION ALL
(
    SELECT '999000003000000000000000003000000000000000000000000000000'
)
    ) TO STDOUT;
  `,
  l2_all_inc_fix: `
     COPY( WITH parametros AS (
    SELECT 
        now() AS data_atual,
        to_char(now(), 'DDMMYYYYHHMMSS') AS data_cabecalho,
        to_char(current_date + 3, 'YYYYMMDD') AS data_vencimento,
        'Gabriel Mauricio' AS nome,
        'acionado' AS status,
        1 AS empresa_alvo,
        ${assessoria} AS carteira_alvo
),
base_devedor AS (
    SELECT 
        d.devid,
        d.devempcod,
        p.data_atual,
        p.data_cabecalho,
        p.data_vencimento,
        p.nome,
        p.status
    FROM devedor d, parametros p
    WHERE d.devati = 0 AND d.devsal > 50 AND d.devempcod = p.empresa_alvo AND d.carcod = p.carteira_alvo
    ORDER BY random() LIMIT 10
),
registros AS (
    SELECT '000' || data_cabecalho || '00${assessoria}02' || '0000000001' AS linha
    FROM parametros
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad('2', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||status 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad('1', 20, ' ') ||
           rpad('',16,' ') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||status 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad('1', 20, ' ') ||
           to_char(data_atual+interval '1 day', 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||status 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad('1', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad('', 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||status  
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad('1', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '000' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||status 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad('', 20, ' ') || rpad('1', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||status 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001' || rpad(devid, 20, ' ') || rpad('1', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') 
    FROM base_devedor LIMIT 1)
    UNION ALL
    SELECT '999000003000000000000000003000000000000000000000000000000'
)
SELECT * FROM registros)TO STDOUT;
  `,
  l2_same_dev_fix: `
    COPY (
WITH primeiro AS (
  SELECT devid, devempcod
  FROM devedor d
  WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
  ORDER BY random()
  LIMIT 1
),
restantes AS (
  SELECT devid, devempcod
  FROM devedor d
  WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
  ORDER BY random()
  LIMIT 2
)
SELECT
  '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}02' || '0000000001'
UNION ALL
SELECT
    '4001' ||
  rpad(devid, 20, ' ') ||
  rpad(devempcod::text, 20, ' ') ||
  to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
  '012' ||
  to_char(current_date + 3, 'YYYYMMDD') ||
  rpad('GABRIEL MAURICIO', 50, ' ') ||
  rpad('47992353808',85,' ')||
  'acionado'
FROM primeiro
UNION ALL
SELECT
    '4001' ||
  rpad(devid, 20, ' ') ||
  rpad(devempcod::text, 20, ' ') ||
  to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
  '012' ||
  to_char(current_date + 3, 'YYYYMMDD') ||
  rpad('GABRIEL MAURICIO', 50, ' ') ||
  rpad('47992353808',85,' ')||
  'acionado'
FROM primeiro
UNION ALL
SELECT
    '4001' ||
  rpad(devid, 20, ' ') ||
  rpad(devempcod::text, 20, ' ') ||
  to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
  '012' ||
  to_char(current_date + 3, 'YYYYMMDD') ||
  rpad('GABRIEL MAURICIO', 50, ' ') ||
  rpad('47992353808',85,' ')||
  'acionado'
FROM restantes
UNION ALL
        (
            SELECT '999000003000000000000000003000000000000000000000000000000'
        )
    ) TO STDOUT;
  `,
  l2_same_tel_inv_fix: `
    COPY (
WITH primeiro AS (
  SELECT devid, devempcod
  FROM devedor d
  WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
  ORDER BY random()
  LIMIT 1
),
restantes AS (
  SELECT devid, devempcod
  FROM devedor d
  WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
  ORDER BY random()
  LIMIT 2
)
SELECT
  '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}02' || '0000000001'
UNION ALL
SELECT
    '4001' ||
  rpad(devid, 20, ' ') ||
  rpad(devempcod::text, 20, ' ') ||
  to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
  '012' ||
  to_char(current_date + 3, 'YYYYMMDD') ||
  rpad('GABRIEL MAURICIO', 50, ' ') ||
  rpad('47992353808',85,' ')||
  'acionado'
FROM primeiro
UNION ALL
SELECT
    '4001' ||
  rpad(devid, 20, ' ') ||
  rpad(devempcod::text, 20, ' ') ||
  to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
  '012' ||
  to_char(current_date + 3, 'YYYYMMDD') ||
  rpad('GABRIEL MAURICIO', 50, ' ') ||
  rpad('4792353808',85,' ')||
  'acionado'
FROM primeiro
UNION ALL
        (
            SELECT '999000003000000000000000003000000000000000000000000000000'
        )
    ) TO STDOUT;
  `,
  l2_same_email_mix_fix: `
    COPY (

    WITH primeiro AS (
      SELECT devid, devempcod
      FROM devedor d
      WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
      ORDER BY random()
      LIMIT 1
    ),
    restantes AS (
      SELECT devid, devempcod
      FROM devedor d
      WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
      ORDER BY random()
      LIMIT 2
    )
    SELECT
      '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}02' || '0000000001'
    UNION ALL(
    SELECT
        '4001' ||
      rpad(devid, 20, ' ') ||
      rpad(devempcod::text, 20, ' ') ||
      to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
      '012' ||
      to_char(current_date + 3, 'YYYYMMDD') ||
      rpad('GABRIEL MAURICIO', 50, ' ') ||
      rpad('',15,' ')||
      rpad('novoemailgmail.com',70,' ')||
      'acionado'
    FROM primeiro)
    UNION ALL(
    SELECT
        '4001' ||
      rpad(devid, 20, ' ') ||
      rpad(devempcod::text, 20, ' ') ||
      to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
      '012' ||
      to_char(current_date + 3, 'YYYYMMDD') ||
      rpad('GABRIEL MAURICIO', 50, ' ') ||
      rpad('',15,' ')||
      RPAD('novoemail@gmail.com',70,' ')||
      'acionado'
    FROM primeiro)
    UNION ALL
            (
                SELECT '999000003000000000000000003000000000000000000000000000000'
            )    
    ) TO STDOUT;
  `,
  l2_dist_dev_fix: `
    COPY (
        SELECT '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}02' || '0000000001'
        UNION ALL
        (
            SELECT
                '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
                to_char(now(), 'YYYYMMDDHH24:MI:SS') || '012' ||
                to_char(current_date + 3, 'YYYYMMDD') ||
                rpad('Gabriel Mauricio', 50, ' ') ||
                rpad('47992353808',85,' ')||
                'acionado'
            FROM devedor d
            WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = 58
            ORDER BY random() LIMIT 1
        ) Union all 
        (
            SELECT
                '4001' || rpad(devid, 20, ' ') || rpad(devempcod::text, 20, ' ') ||
                to_char(now(), 'YYYYMMDDHH24:MI:SS') || '012' ||
                to_char(current_date + 3, 'YYYYMMDD') ||
                rpad('Gabriel Mauricio', 50, ' ') ||
                rpad('47992353808',85,' ')||
                'acionado'
            FROM devedor d
            WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
            ORDER BY random() LIMIT 2
        )
        UNION ALL
        (
            SELECT '999000003000000000000000003000000000000000000000000000000'
        )
    ) TO STDOUT;
  `,
  //layout 3
  //sem inc
  l3_ok: `
        copy(
SELECT 
    '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}03' || '0000000001'
UNION ALL(
SELECT
    '4001' ||
    RPAD(REPLACE(gen_random_uuid()::text, '-', ''), 40, ' ') ||
    rpad(devid, 20, ' ') ||
    rpad(devempcod::text, 20, ' ') ||
    to_char(now(), 'YYYYMMDDHH24:MI:SS') ||  
    '012' ||
    to_char(current_date + 3, 'YYYYMMDD') ||
    rpad('Gabriel Mauricio', 50, ' ') ||
    rpad('47992353808', 15, ' ') ||
    rpad('', 70, ' ') ||
    'acionado'
FROM devedor d 
WHERE devati = 0 
AND devsal > 50 
AND devempcod = 1 
AND carcod = ${assessoria} 
ORDER BY random() 
LIMIT 3)
UNION ALL
(
SELECT 
    '999000003000000000000000003000000000000000000000000000000'
)
    )to stdout;
  `,
  l3_1inc: `
        COPY (
  SELECT 
    '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}03' || '0000000001'
  UNION ALL
  (
    SELECT 
      '4001' ||
      (
        SELECT RPAD(
          (
            SELECT STRING_AGG(
              SUBSTRING(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                FROM FLOOR(RANDOM() * 62 + 1)::INT FOR 1
              ), ''
            )
            FROM GENERATE_SERIES(1, FLOOR(RANDOM() * 40 + 1)::INT)
          ), 
          40, ' '
        )
      ) ||
      RPAD(devid, 20, ' ') ||
      RPAD(devempcod::text, 20, ' ') ||
      to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
      '012' ||
      to_char(current_date + 3, 'YYYYMMDD') ||
      RPAD('', 50, ' ') ||
      RPAD('47992353808', 15, ' ') ||
      RPAD('', 70, ' ') ||
      'acionado'
    FROM devedor d 
    WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria} 
    ORDER BY random() 
    LIMIT 1
  )
  UNION ALL
  (
    SELECT 
      '4001' ||
      (
        SELECT RPAD(
          (
            SELECT STRING_AGG(
              SUBSTRING(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                FROM FLOOR(RANDOM() * 62 + 1)::INT FOR 1
              ), ''
            )
            FROM GENERATE_SERIES(1, FLOOR(RANDOM() * 40 + 1)::INT)
          ), 
          40, ' '
        )
      ) ||
      RPAD(devid, 20, ' ') ||
      RPAD(devempcod::text, 20, ' ') ||
      to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
      '012' ||
      to_char(current_date + 3, 'YYYYMMDD') ||
      RPAD('Gabriel Mauricio', 50, ' ') ||
      RPAD('47992353808', 15, ' ') ||
      RPAD('', 70, ' ') ||
      'acionado'
    FROM devedor d 
    WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria} 
    ORDER BY random() 
    LIMIT 2
  )
  UNION ALL
  (
    SELECT '999000003000000000000000003000000000000000000000000000000'
  )
) TO STDOUT;
  `,
  l3_all_inc: `
    COPY(
WITH parametros AS (
    SELECT 
        now() AS data_atual,
        to_char(now(), 'DDMMYYYYHHMMSS') AS data_cabecalho,
        to_char(current_date + 3, 'YYYYMMDD') AS data_vencimento,
        'Gabriel Mauricio' AS nome,
        'acionado' AS acionamento,
        1 AS empresa_alvo,
        ${assessoria} AS carteira_alvo
),
base_devedor AS (
    SELECT 
        d.devid,
        d.devempcod,
        p.data_atual,
        p.data_cabecalho,
        p.data_vencimento,
        p.nome,
        p.acionamento
    FROM devedor d, parametros p
    WHERE d.devati = 0 AND d.devsal > 50 AND d.devempcod = p.empresa_alvo AND d.carcod = p.carteira_alvo
    ORDER BY random() LIMIT 10
),
registros AS (
    SELECT '000' || data_cabecalho || '00${assessoria}03' || '0000000001' AS linha
    FROM parametros
    UNION ALL(
    SELECT '4001'||
      (
        SELECT RPAD(
          (
            SELECT STRING_AGG(
              SUBSTRING(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                FROM FLOOR(RANDOM() * 62 + 1)::INT FOR 1
              ), ''
            )
            FROM GENERATE_SERIES(1, FLOOR(RANDOM() * 40 + 1)::INT)
          ), 
          40, ' '
        )
      )  || rpad(devid, 20, ' ') || rpad('2', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||acionamento 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001'||
      (
        SELECT RPAD(
          (
            SELECT STRING_AGG(
              SUBSTRING(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                FROM FLOOR(RANDOM() * 62 + 1)::INT FOR 1
              ), ''
            )
            FROM GENERATE_SERIES(1, FLOOR(RANDOM() * 40 + 1)::INT)
          ), 
          40, ' '
        )
      )  || rpad(devid, 20, ' ') || rpad('2', 20, ' ') ||
           rpad('',16,' ') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||acionamento 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001'||
      (
        SELECT RPAD(
          (
            SELECT STRING_AGG(
              SUBSTRING(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                FROM FLOOR(RANDOM() * 62 + 1)::INT FOR 1
              ), ''
            )
            FROM GENERATE_SERIES(1, FLOOR(RANDOM() * 40 + 1)::INT)
          ), 
          40, ' '
        )
      )  || rpad(devid, 20, ' ') || rpad('2', 20, ' ') ||
           to_char(data_atual + interval '1 day', 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||acionamento 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001'||
      (
        SELECT RPAD(
          (
            SELECT STRING_AGG(
              SUBSTRING(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                FROM FLOOR(RANDOM() * 62 + 1)::INT FOR 1
              ), ''
            )
            FROM GENERATE_SERIES(1, FLOOR(RANDOM() * 40 + 1)::INT)
          ), 
          40, ' '
        )
      )  || rpad(devid, 20, ' ') || rpad('2', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad('', 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||acionamento 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001'||
      (
        SELECT RPAD(
          (
            SELECT STRING_AGG(
              SUBSTRING(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                FROM FLOOR(RANDOM() * 62 + 1)::INT FOR 1
              ), ''
            )
            FROM GENERATE_SERIES(1, FLOOR(RANDOM() * 40 + 1)::INT)
          ), 
          40, ' '
        )
      )  || rpad('', 20, ' ') || rpad('2', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001'||
      (
        SELECT RPAD(
          (
            SELECT STRING_AGG(
              SUBSTRING(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                FROM FLOOR(RANDOM() * 62 + 1)::INT FOR 1
              ), ''
            )
            FROM GENERATE_SERIES(1, FLOOR(RANDOM() * 40 + 1)::INT)
          ), 
          40, ' '
        )
      )  || rpad(devid, 20, ' ') || rpad('2', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('',15,' ') || rpad('',70,' ') ||acionamento 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001'||
      (
        SELECT RPAD('',40, ' ')
      )  || rpad(devid, 20, ' ') || rpad('2', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||acionamento 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001'||
      (
        SELECT RPAD(
          (
            SELECT STRING_AGG(
              SUBSTRING(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                FROM FLOOR(RANDOM() * 62 + 1)::INT FOR 1
              ), ''
            )
            FROM GENERATE_SERIES(1, FLOOR(RANDOM() * 40 + 1)::INT)
          ), 
          40, ' '
        )
      )  || rpad(devid, 20, ' ') || rpad('2', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || rpad('',3,' ') ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('',15,' ') || rpad('teste@gmail.com',70,' ') ||acionamento 
    FROM base_devedor LIMIT 1)
    UNION ALL
    SELECT '999000003000000000000000003000000000000000000000000000000'
)
SELECT * FROM registros)TO STDOUT;
  `,
  l3_same_dev: `
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;
copy(
WITH primeiro AS (
  SELECT devid, devempcod
  FROM devedor d
  WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
  ORDER BY random()
  LIMIT 1
),
restantes AS (
  SELECT devid, devempcod
  FROM devedor d
  WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
  ORDER BY random()
  LIMIT 2
),
linha_repetida_base AS (
  SELECT 
    devid,
    devempcod,
    to_char(now(), 'YYYYMMDDHH24:MI:SS') as datahora,
    to_char(current_date + 3, 'YYYYMMDD') as data_futura,
    'GABRIEL MAURICIO' as nome,
    '47992353808' as telefone
  FROM primeiro
)
SELECT
  '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}03' || '0000000001'
UNION ALL
(
SELECT
  '4001' ||
  RPAD(REPLACE(gen_random_uuid()::text, '-', ''), 40, ' ') ||
  RPAD(devid, 20, ' ') ||
  RPAD(devempcod::text, 20, ' ') ||
  datahora ||
  '012' ||
  data_futura ||
  RPAD(nome, 50, ' ') ||
  RPAD(telefone, 15, ' ') ||
  RPAD('', 70, ' ') ||
  'acionado'
FROM linha_repetida_base
)
UNION ALL
(
SELECT
  '4001' ||
  RPAD(REPLACE(gen_random_uuid()::text, '-', ''), 40, ' ') ||
  RPAD(devid, 20, ' ') ||
  RPAD(devempcod::text, 20, ' ') ||
  datahora ||
  '012' ||
  data_futura ||
  RPAD(nome, 50, ' ') ||
  RPAD(telefone, 15, ' ') ||
  RPAD('', 70, ' ') ||
  'acionado'
FROM linha_repetida_base
)
UNION ALL
(
SELECT
  '4001' ||
  RPAD(REPLACE(gen_random_uuid()::text, '-', ''), 40, ' ') ||
  RPAD(devid, 20, ' ') || 
  RPAD(devempcod::text, 20, ' ') ||
  to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
  '012' ||
  to_char(current_date + 3, 'YYYYMMDD') ||
  RPAD('GABRIEL MAURICIO', 50, ' ') ||
  RPAD('47992353808', 15, ' ') ||
  RPAD('', 70, ' ') ||
  'acionado'
FROM restantes
)
UNION ALL
(
SELECT '999000003000000000000000003000000000000000000000000000000'
)
)to STDOUT;
`,
  l3_same_tel_inv: `  `,
  l3_same_email_mix: `  `,
  l3_dist_dev: `  `,

  // Com inconsistências tratadas
  l3_ok_fix: `
    COPY (
            SELECT 
                '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}03' || '0000000001'
            UNION ALL
            SELECT
                '4001' ||
                (
                    SELECT string_agg(
                            SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                                        FROM FLOOR(RANDOM() * 62 + 1)::int FOR 1), 
                            ''
                        ) AS random_string
                    FROM generate_series(1, (FLOOR(RANDOM() * 40 + 1))::int)
                ) ||
                rpad(devid, 20, ' ') ||
                rpad(devempcod::text, 20, ' ') ||
                to_char(now(), 'YYYYMMDDHH24:MI:SS') ||  
                '012' ||
                to_char(current_date + 3, 'YYYYMMDD') ||
                rpad('Gabriel Mauricio', 50, ' ') ||
                rpad('47992353808', 15, ' ') ||
                rpad('', 70, ' ') ||
                'acionado'
            FROM devedor d 
            WHERE devati = 0 
            AND devsal > 50 
            AND devempcod = 1 
            AND carcod = ${assessoria} 
            ORDER BY random() 
            LIMIT 3
            UNION ALL
            SELECT 
                '999000003000000000000000003000000000000000000000000000000'
        ) TO STDOUT;
  `,
  l3_1inc_fix: `
            COPY (
  SELECT 
    '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}03' || '0000000001'
  UNION ALL
  (
    SELECT 
      '4001' ||
      (
        SELECT RPAD(
          (
            SELECT STRING_AGG(
              SUBSTRING(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                FROM FLOOR(RANDOM() * 62 + 1)::INT FOR 1
              ), ''
            )
            FROM GENERATE_SERIES(1, FLOOR(RANDOM() * 40 + 1)::INT)
          ), 
          40, ' '
        )
      ) ||
      RPAD(devid, 20, ' ') ||
      RPAD(devempcod::text, 20, ' ') ||
      to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
      '012' ||
      to_char(current_date + 3, 'YYYYMMDD') ||
      RPAD('', 50, ' ') ||
      RPAD('47992353808', 15, ' ') ||
      RPAD('', 70, ' ') ||
      'acionado'
    FROM devedor d 
    WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria} 
    ORDER BY random() 
    LIMIT 1
  )
  UNION ALL
  (
    SELECT 
      '4001' ||
      (
        SELECT RPAD(
          (
            SELECT STRING_AGG(
              SUBSTRING(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                FROM FLOOR(RANDOM() * 62 + 1)::INT FOR 1
              ), ''
            )
            FROM GENERATE_SERIES(1, FLOOR(RANDOM() * 40 + 1)::INT)
          ), 
          40, ' '
        )
      ) ||
      RPAD(devid, 20, ' ') ||
      RPAD(devempcod::text, 20, ' ') ||
      to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
      '012' ||
      to_char(current_date + 3, 'YYYYMMDD') ||
      RPAD('Gabriel Mauricio', 50, ' ') ||
      RPAD('47992353808', 15, ' ') ||
      RPAD('', 70, ' ') ||
      'acionado'
    FROM devedor d 
    WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria} 
    ORDER BY random() 
    LIMIT 2
  )
  UNION ALL
  (
    SELECT '999000003000000000000000003000000000000000000000000000000'
  )
) TO STDOUT;
  `,
  l3_all_inc_fix: `
    COPY(
WITH parametros AS (
    SELECT 
        now() AS data_atual,
        to_char(now(), 'DDMMYYYYHHMMSS') AS data_cabecalho,
        to_char(current_date + 3, 'YYYYMMDD') AS data_vencimento,
        'Gabriel Mauricio' AS nome,
        'acionado' AS acionamento,
        1 AS empresa_alvo,
        ${assessoria} AS carteira_alvo
),
base_devedor AS (
    SELECT 
        d.devid,
        d.devempcod,
        p.data_atual,
        p.data_cabecalho,
        p.data_vencimento,
        p.nome,
        p.acionamento
    FROM devedor d, parametros p
    WHERE d.devati = 0 AND d.devsal > 50 AND d.devempcod = p.empresa_alvo AND d.carcod = p.carteira_alvo
    ORDER BY random() LIMIT 10
),
registros AS (
    SELECT '000' || data_cabecalho || '00${assessoria}03' || '0000000001' AS linha
    FROM parametros
    UNION ALL(
    SELECT '4001'||
      (
        SELECT RPAD(
          (
            SELECT STRING_AGG(
              SUBSTRING(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                FROM FLOOR(RANDOM() * 62 + 1)::INT FOR 1
              ), ''
            )
            FROM GENERATE_SERIES(1, FLOOR(RANDOM() * 40 + 1)::INT)
          ), 
          40, ' '
        )
      )  || rpad(devid, 20, ' ') || rpad('2', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||acionamento 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001'||
      (
        SELECT RPAD(
          (
            SELECT STRING_AGG(
              SUBSTRING(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                FROM FLOOR(RANDOM() * 62 + 1)::INT FOR 1
              ), ''
            )
            FROM GENERATE_SERIES(1, FLOOR(RANDOM() * 40 + 1)::INT)
          ), 
          40, ' '
        )
      )  || rpad(devid, 20, ' ') || rpad('2', 20, ' ') ||
           rpad('',16,' ') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||acionamento 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001'||
      (
        SELECT RPAD(
          (
            SELECT STRING_AGG(
              SUBSTRING(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                FROM FLOOR(RANDOM() * 62 + 1)::INT FOR 1
              ), ''
            )
            FROM GENERATE_SERIES(1, FLOOR(RANDOM() * 40 + 1)::INT)
          ), 
          40, ' '
        )
      )  || rpad(devid, 20, ' ') || rpad('2', 20, ' ') ||
           to_char(data_atual + interval '1 day', 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||acionamento 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001'||
      (
        SELECT RPAD(
          (
            SELECT STRING_AGG(
              SUBSTRING(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                FROM FLOOR(RANDOM() * 62 + 1)::INT FOR 1
              ), ''
            )
            FROM GENERATE_SERIES(1, FLOOR(RANDOM() * 40 + 1)::INT)
          ), 
          40, ' '
        )
      )  || rpad(devid, 20, ' ') || rpad('2', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad('', 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||acionamento 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001'||
      (
        SELECT RPAD(
          (
            SELECT STRING_AGG(
              SUBSTRING(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                FROM FLOOR(RANDOM() * 62 + 1)::INT FOR 1
              ), ''
            )
            FROM GENERATE_SERIES(1, FLOOR(RANDOM() * 40 + 1)::INT)
          ), 
          40, ' '
        )
      )  || rpad('', 20, ' ') || rpad('2', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001'||
      (
        SELECT RPAD(
          (
            SELECT STRING_AGG(
              SUBSTRING(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                FROM FLOOR(RANDOM() * 62 + 1)::INT FOR 1
              ), ''
            )
            FROM GENERATE_SERIES(1, FLOOR(RANDOM() * 40 + 1)::INT)
          ), 
          40, ' '
        )
      )  || rpad(devid, 20, ' ') || rpad('2', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('',15,' ') || rpad('',70,' ') ||acionamento 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001'||
      (
        SELECT RPAD('',40, ' ')
      )  || rpad(devid, 20, ' ') || rpad('2', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || '012' ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('47992353808',15,' ') || rpad('',70,' ') ||acionamento 
    FROM base_devedor LIMIT 1)
    UNION ALL(
    SELECT '4001'||
      (
        SELECT RPAD(
          (
            SELECT STRING_AGG(
              SUBSTRING(
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
                FROM FLOOR(RANDOM() * 62 + 1)::INT FOR 1
              ), ''
            )
            FROM GENERATE_SERIES(1, FLOOR(RANDOM() * 40 + 1)::INT)
          ), 
          40, ' '
        )
      )  || rpad(devid, 20, ' ') || rpad('2', 20, ' ') ||
           to_char(data_atual, 'YYYYMMDDHH24:MI:SS') || rpad('',3,' ') ||
           data_vencimento || rpad(nome, 50, ' ') ||
           rpad('',15,' ') || rpad('teste@gmail.com',70,' ') ||acionamento 
    FROM base_devedor LIMIT 1)
    UNION ALL
    SELECT '999000003000000000000000003000000000000000000000000000000'
)
SELECT * FROM registros)TO STDOUT;
  `,
  l3_same_dev_fix: `
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

WITH primeiro AS (
  SELECT devid, devempcod
  FROM devedor d
  WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
  ORDER BY random()
  LIMIT 1
),
restantes AS (
  SELECT devid, devempcod
  FROM devedor d
  WHERE devati = 0 AND devsal > 50 AND devempcod = 1 AND carcod = ${assessoria}
  ORDER BY random()
  LIMIT 2
),
linha_repetida_base AS (
  SELECT 
    devid,
    devempcod,
    to_char(now(), 'YYYYMMDDHH24:MI:SS') as datahora,
    to_char(current_date + 3, 'YYYYMMDD') as data_futura,
    'GABRIEL MAURICIO' as nome,
    '47992353808' as telefone
  FROM primeiro
)
SELECT
  '000' || to_char(now(), 'DDMMYYYYHHMMSS') || '00${assessoria}03' || '0000000001'
UNION ALL
(
SELECT
  '4001' ||
  RPAD(REPLACE(gen_random_uuid()::text, '-', ''), 40, ' ') ||
  RPAD(devid, 20, ' ') ||
  RPAD(devempcod::text, 20, ' ') ||
  datahora ||
  '012' ||
  data_futura ||
  RPAD(nome, 50, ' ') ||
  RPAD(telefone, 15, ' ') ||
  RPAD('', 70, ' ') ||
  'acionado'
FROM linha_repetida_base
)
UNION ALL
(
SELECT
  '4001' ||
  RPAD(REPLACE(gen_random_uuid()::text, '-', ''), 40, ' ') ||
  RPAD(devid, 20, ' ') ||
  RPAD(devempcod::text, 20, ' ') ||
  datahora ||
  '012' ||
  data_futura ||
  RPAD(nome, 50, ' ') ||
  RPAD(telefone, 15, ' ') ||
  RPAD('', 70, ' ') ||
  'acionado'
FROM linha_repetida_base
)
UNION ALL
(
SELECT
  '4001' ||
  RPAD(REPLACE(gen_random_uuid()::text, '-', ''), 40, ' ') ||
  RPAD(devid, 20, ' ') || 
  RPAD(devempcod::text, 20, ' ') ||
  to_char(now(), 'YYYYMMDDHH24:MI:SS') ||
  '012' ||
  to_char(current_date + 3, 'YYYYMMDD') ||
  RPAD('GABRIEL MAURICIO', 50, ' ') ||
  RPAD('47992353808', 15, ' ') ||
  RPAD('', 70, ' ') ||
  'acionado'
FROM restantes
)
UNION ALL
(
SELECT '999000003000000000000000003000000000000000000000000000000'
)
`,
  l3_same_tel_inv_fix: `
  `,
  l3_same_email_mix_fix: `
  `,
  l3_dist_dev_fix: `
  `,
  //layout 4
  //sem inc
  l4_ok: `
  `,
  l4_1inc: `
  `,
  l4_all_inc: `
  `,
  l4_same_dev: `
  `,
  l4_same_tel_inv: `
  `,
  l4_same_email_mix: `
  `,
  l4_dist_dev: `
  `,

  // Com inconsistências tratadas
  l4_ok_fix: `
  `,
  l4_1inc_fix: `
  `,
  l4_all_inc_fix: `
  `,
  l4_same_dev_fix: `
  `,
  l4_same_tel_inv_fix: `
  `,
  l4_same_email_mix_fix: `
  `,
  l4_dist_dev_fix: `
  `,
  //layout 5
  //sem inc
  l5_ok: `
  `,
  l5_1inc: `
  `,
  l5_all_inc: `
  `,
  l5_same_dev: `
  `,
  l5_same_tel_inv: `
  `,
  l5_same_email_mix: `
  `,
  l5_dist_dev: `
  `,

  // Com inconsistências tratadas
  l5_ok_fix: `
  `,
  l5_1inc_fix: `
  `,
  l5_all_inc_fix: `
  `,
  l5_same_dev_fix: `
  `,
  l5_same_tel_inv_fix: `
  `,
  l5_same_email_mix_fix: `
  `,
  l5_dist_dev_fix: ` 
  `,
};
