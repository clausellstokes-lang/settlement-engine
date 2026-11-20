-- plant.sql — test values only: a fake master secret and one fake provider key for user 2222.
alter database :"DBNAME" set app.settings.byok_secret = 'TEST-MASTER-SECRET-not-real';
