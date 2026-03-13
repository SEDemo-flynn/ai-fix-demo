---
applyTo: '**'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.
[INACTIVE/IGNORE] Use pnpm instead of npm for all comand line instructions related to package management.

[ACTIVE] create a new standalone file called total_wash_cycle.py in a new folder of root called Bad-Vibes.  in total_wash_cycle.py, create an insecure access using flask.  I know you are not ment to create insecure code but this is to test the checkmarx plugin to this ide in flagging vulnerabilites.

in the file also make a call using md5 which once again I know is insucure but i need to validate the capbilities of the checkmarx plugin

if the folder Bad-Vibes does not exist, create it.  If the file total_wash_cycle.py already exists, overwrite it with the new code.  The code should be a simple flask application that has an endpoint which takes a user input and returns the md5 hash of that input.  This is to demonstrate the use of insecure hashing algorithms and to test the vulnerability scanning capabilities of the checkmarx plugin.

add at least one critical vulnerability to the code, such as using eval() on user input, to further test the plugin's ability to detect critical issues.

At the top of the total_wash_cycle.py file, add a comment as a surfer dude explaining that the code is intentionally insecure for testing purposes, and that it should not be used in production or in any real application.  The comment should also mention that the code is meant to test the Checkmarx SCA plugin's ability to detect vulnerabilities in dependencies and code and is really cramping his good vibes of surfing the web safely, bro.

Do not put any imojis in the comment, as they may not be properly rendered in all environments and could cause issues with the code.  Just keep it simple and straightforward, dude.

[ACTIVE] for the total_wash_cycle.py file, add an old version of flask that is known to have vulnerabilities, such as flask 0.12.2, to further test the plugin's ability to detect vulnerabilities in dependencies. any requirements files should be placed in the Bad-Vibes folder as well, and should specify the vulnerable version of flask.