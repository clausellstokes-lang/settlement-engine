\timing off
set track_functions = 'all';
select pg_stat_reset();
select length(data::text) from public.get_gallery_dossier('fa-p');
select pg_sleep(0.6);
select funcname, calls, round(total_time) tot, round(self_time) self from pg_stat_user_functions order by total_time desc limit 25;
