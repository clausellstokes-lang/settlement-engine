# The full database-permissions fix: what to paste, in what order, and what you should see

**What this is.** Some doors in the live database were open by accident: tools meant only for the server could be
called by any visitor, a signed-in user could change fields on their own profile that only the server should set,
and an owner could undo a staff ban on their own town. This fix closes them. It has four parts. Nothing in it
deletes or changes anyone's data.

**Who checked it.** A builder wrote it. An independent security reader, who did not write it, cleared it
(its word, twice: the fix itself, and then these files and what they show). I read every hand-written line and ran my own tests. All of that was done on a copy of the database
that lives only on a test machine. **Nobody but you has touched the live database, and your own run is the only
proof about it.** That is why half of the steps below are "look" steps: they change nothing and show you the result.

**Where.** The Supabase dashboard of the live project, the SQL editor. Paste one file, run it, read the result,
then the next. Every file is safe to run twice. If you already ran the urgent files, that is fine: this set
includes them again and running them twice does nothing.

**If a step shows something other than what is written here: stop there and tell me what it showed.** Nothing is
left half-done by stopping between steps. Please never paste a key or a password into the chat.

## The ten steps

| step | file | what it does | what you should see |
|---|---|---|---|
| 1 | `step-01-look-are-new-functions-open.sql` | LOOKS ONLY. Asks: if a new server tool were added today, would visitors get it by default? | One row. `running_as` says **postgres**; the two other columns say **true** and **true**. **If `running_as` says anything other than postgres, stop here and tell me.** |
| 2 | `step-02-count-stored-keys.sql` | LOOKS ONLY. Counts how many users have saved an AI provider key. | One number, under `byok_keys`. **Tell me this number.** |
| 3 | `step-03-close-the-functions.sql` | Closes about 245 server-only tools to visitors and signed-in users. The server keeps them. A tool the live database does not have yet is skipped. | "Success. No rows returned." |
| 4 | `step-04-close-new-functions-by-default.sql` | From now on, a new server tool is closed to visitors by default. | "Success. No rows returned." |
| 5 | `step-05-look-again-are-new-functions-open.sql` | LOOKS ONLY. The same question as step 1. | One row. `running_as` says **postgres** again; the two other columns now say **false** and **false**. If either still says true, or `running_as` is not postgres, stop and tell me. |
| 6 | `step-06-protect-profile-fields.sql` | A signed-in user may change only four fields of their own profile (picture, email notices, AI model choice, whether their name shows publicly). Everything else, such as the paid tier, credits and the free-narrative claim, is set by the server alone. | "Success. No rows returned." |
| 7 | `step-07-look-profile-fields.sql` | LOOKS ONLY. Lists every profile field and whether a signed-in user may change it. | About 28 rows. **Exactly four say true**: `avatar_url`, `email_notifications`, `model_preference`, `public_identity_opt_in`. If any other row says true, tell me which. |
| 8 | `step-08-protect-towns-and-campaigns.sql` | An owner can no longer undo a staff ban or a staff removal on their own town or campaign, mark it featured, or change its view counts. Saving, renaming and publishing work as before. | "Success. No rows returned." |
| 9 | `step-09-look-the-two-guards.sql` | LOOKS ONLY. Shows the two guards from step 8 are in place. | Two rows: one for `settlements`, one for `saved_maps`. The `tgenabled` column says **O** on both. |
| 10 | `step-10-the-check-that-matters.sql` | LOOKS ONLY. Lists every tool a visitor or a signed-in user can still call that is not meant for them. | **No rows.** This is the one result that says the fix worked. |

Two more files are optional detail and you can skip them: `optional-detail-every-function-before.sql` and
`optional-detail-every-function-after.sql` are the same look, listing all 245 tools one by one with who may call
each. Before step 3 many rows say true in the `anon` and `authenticated` columns; after step 3 none do.

## Why `running_as` must say postgres

Steps 1 and 5 ask the database a question on behalf of whoever is running the query. Releases are applied by the
account called postgres, and the SQL editor normally runs as postgres too. If the editor were ever running as a
different account, step 4 would change that account's default and not the one releases use: step 5 would then say
"false, false" and look finished while new server tools stayed open. Checking that `running_as` says postgres at
both steps is what rules that out. The independent reader asked for this to be spelled out.

## What your users will notice

Nothing, with one exception. Today, when the civility filter refuses a display name, the site quietly writes the
name anyway through a back door. After step 6 that back door is shut, so the user sees an error instead. The next
release shows the filter's own friendlier message. If you would rather wait for that release, run step 6 and
step 7 with it; every other step can go now.

## It does not matter when you run this

Before the next release or after it, in the same order: I tested both and every tool ends up with exactly the
same access either way. The next release carries the same fix as a migration (number 211); it will find the work
already done and change nothing.

## Keep step 10 for later

Run `step-10-the-check-that-matters.sql` again after every future release. It should always return no rows. If it
ever returns a row, a new server tool has been left open and I need to know.

## How to undo

Each file's first lines give the one statement that undoes it. In plain terms: step 3 is undone tool by tool,
step 4 and step 6 by one line each, and step 8 by removing the two guards. Undoing re-opens the door it closed, so
tell me first what went wrong.

## What this does not fix (so you hear it from me)

Someone who already holds an account's internal id can still ask the database whether that account is staff or
premium, and get a yes or no. It is the smallest of the faults found and it is scheduled for after the first
release, because closing it now would mean re-opening text the security reader has just cleared.
