-- String(n) of a JSON number, exactly as JavaScript spells the double it reads (the review's F2 (b)).
-- ECMAScript Number::toString: the fewest digits s (k of them) such that s x 10^(n-k) reads back as
-- the same double; of two, the closer to the double's exact value; of a tie, the even. The double is
-- PostgreSQL's correctly rounded reading of the decimal (float8 input), taken apart by its bits
-- (float8send), so its exact value and its rounding interval are numeric, and nothing depends on the
-- float8 OUTPUT (whose shortest form refuses an exact half-way bound) or on a setting. Plain from 1e-6
-- up to 1e21, exponential outside it. Zero and the infinities come from the exact range tests first, so
-- no cast is asked of an out-of-range value (F3). An integer of at most 15 digits is that integer.
create or replace function public._gallery_veil_numstr(t text)
returns text language plpgsql immutable set search_path = public, pg_temp as $$
declare
  x numeric;
  b bytea;
  ex int;
  mant numeric;
  e2 int;
  v numeric;      -- the double's exact value, positive
  half numeric;   -- half the spacing above it
  halflo numeric; -- half the spacing below it
  lo numeric;
  hi numeric;
  inclusive boolean;
  e10 int;
  p int;
  m int;
  s numeric;
  c1 numeric;
  c2 numeric;
  ok1 boolean;
  ok2 boolean;
  digits text;
  k int;
  n int;
  tz int;
  out text;
begin
  if t ~ '^-?[0-9]{1,15}$' then return t; end if;
  x := t::numeric;
  if public._gallery_veil_num_zero(x) then return '0'; end if;
  if public._gallery_veil_num_inf(x) then return case when x < 0 then '-Infinity' else 'Infinity' end; end if;
  b := float8send(abs(x)::float8);
  ex := ((get_byte(b, 0) & 127) << 4) | (get_byte(b, 1) >> 4);
  mant := (get_byte(b, 1) & 15)::numeric * 281474976710656 + get_byte(b, 2)::numeric * 1099511627776
    + get_byte(b, 3)::numeric * 4294967296 + get_byte(b, 4)::numeric * 16777216
    + get_byte(b, 5)::numeric * 65536 + get_byte(b, 6)::numeric * 256 + get_byte(b, 7)::numeric;
  if ex = 0 then e2 := -1074; else mant := mant + 4503599627370496; e2 := ex - 1075; end if;
  -- exact powers of two as numeric: 2^e for e >= 0, and 2^-e = 5^e / 10^e spelled as a decimal
  if e2 >= 0 then
    v := mant * power(2::numeric, e2);
    half := power(2::numeric, e2) / 2;
  else
    v := (mant * power(5::numeric, -e2)) * ('1e' || e2)::numeric;
    half := power(5::numeric, 1 - e2) * ('1e' || (e2 - 1))::numeric;
  end if;
  halflo := case when mant = 4503599627370496 and ex > 1 then half / 2 else half end;
  inclusive := mod(mant, 2) = 0;
  lo := v - halflo;
  hi := v + half;
  e10 := floor(log(v))::int;
  if power(10::numeric, e10 + 1) <= v then e10 := e10 + 1; end if;
  if power(10::numeric, e10) > v then e10 := e10 - 1; end if;
  for p in 1..17 loop
    m := e10 - p + 1;
    s := trunc(v * ('1e' || (-m))::numeric);
    c1 := s * ('1e' || m)::numeric;
    c2 := (s + 1) * ('1e' || m)::numeric;
    ok1 := case when inclusive then c1 >= lo else c1 > lo end;
    ok2 := case when inclusive then c2 <= hi else c2 < hi end;
    if ok1 or ok2 then
      if ok1 and ok2 then
        if v - c1 > c2 - v or (v - c1 = c2 - v and mod(s, 2) = 1) then s := s + 1; end if;
      elsif ok2 then s := s + 1;
      end if;
      exit;
    end if;
  end loop;
  digits := s::text;
  tz := length(digits) - length(rtrim(digits, '0'));
  digits := rtrim(digits, '0');
  k := length(digits);
  n := k + m + tz;
  if k <= n and n <= 21 then out := digits || repeat('0', n - k);
  elsif 0 < n and n <= 21 then out := left(digits, n) || '.' || substr(digits, n + 1);
  elsif -6 < n and n <= 0 then out := '0.' || repeat('0', -n) || digits;
  else out := left(digits, 1) || case when k > 1 then '.' || substr(digits, 2) else '' end
    || 'e' || case when n - 1 < 0 then '-' else '+' end || abs(n - 1)::text;
  end if;
  return case when x < 0 then '-' else '' end || out;
end $$;
