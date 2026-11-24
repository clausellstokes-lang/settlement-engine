-- Cut by the chair from FOR-THE-OWNER-URGENT.sql at commit 0ea91fe18 (cleared by the security reader REVIEW-GRANTS-1).
-- Not one statement is changed. It only reads: one number.

-- Block 0b, READS ONLY: how many users have a stored provider key (a number only).
select count(*) as byok_keys from public.surveyor_byok_keys;

