Whenever a user posts a massive, their totalPostsEver number increments by 1. This totalPostsEver number is assigned to the massive. The intent is to allow the user's timeline to be pulled from the database by going:

"Ok, the user's totalPostsEver is 538; therefore, if we want to pull the most recent 15 massives they've posted, we query massives 523 to 538 (the most recent 15 massives). As the viewer scrolls down the user's profile, we can load the following batch of massives by going, 'time for page 2, which is...'". etc.

### A design question

How do we wanna handle replies? Do they count as a massive and show up on the user's profile by default? Or does the viewer click a "include replies" button to show them, like on Twitter?

The simplest way seems to be: Consider a reply to be a massive, but set it up so replies can be excluded from retrieval if it is deemed desirable.
