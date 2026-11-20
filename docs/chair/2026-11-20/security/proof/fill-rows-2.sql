-- fill-rows-2.sql — the rows fill-rows.sql cannot make generically (their checks need real values). Test values only.
\set ON_ERROR_STOP 0
insert into public.redeem_codes (code, kind, credit_amount) values ('PROBE-CODE', 'credits', 5);
insert into public.redemptions (code, user_id, status) values ('PROBE-CODE', '22222222-2222-2222-2222-222222222222', 'applied');
insert into public.referrals (referrer_user_id, referee_user_id, referrer_account_number, status) values ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'SF-PROBE01', 'pending');
insert into public.custom_content (user_id, category, data) values ('22222222-2222-2222-2222-222222222222', 'institutions', '{"name":"Probe"}');
insert into public.consent_change_records (user_id, consent_key, prior_value, new_value, consent_model_version, source) values ('22222222-2222-2222-2222-222222222222', 'research', false, true, 1, 'account');
insert into public.operator_messages (kind, message_class, sender_role, subject, body, status, recipient_user_id, audience_count, sent_at, template_key)
  select 'direct', public.operator_message_class_for_template(k), 'admin', 'Probe', 'Probe body', 'sent', '22222222-2222-2222-2222-222222222222', 1, now(), k
  from (select unnest(array['account_notice','service_notice','general','support_reply']) k) x where public.operator_message_class_for_template(k) is not null limit 1;
insert into public.custom_content_revisions (owner_id, definition_id, revision_no, content_hash, data)
  select d.owner_id, d.id, 1, repeat('a', 64), '{}'::jsonb from public.custom_content_definitions d limit 1;
