# Impeccable

## Start every project with context

- Run /impeccable init once per project so the skill reads your code, asks only what it cannot infer and writes PRODUCT.md.

- Run /impeccable document to capture your existing visual system in DESIGN.md so later changes stay on brand.

- Name one command and one target in every request, because a single section reviewed closely beats a whole page at a glance.

## Steer the design with commands

- Use bolder to amplify a safe design and quieter to tone down a loud one.

- Use distill to remove what the page does not need and colorize to bring color to a gray interface.

- Use typeset to fix fonts, hierarchy and sizing, and layout to fix spacing and rhythm.

- Use animate to add transitions and interaction feedback, and delight to add personality without changing the layout.

- Use overdrive only when the brief asks for shaders, spring physics or scroll-driven effects.

## Review before you ship

- Run critique for a scored UX review that ranks what to fix first.

- Run audit for a technical quality report that covers accessibility, performance, theming and responsive behavior with findings ranked P0 to P3.

- Run polish as the final pass before shipping and harden to cover errors, internationalization, overflow and edge cases.

- Run clarify to rewrite unclear copy and adapt to handle screen sizes and devices.

- Run the detector with npx impeccable detect on a directory or a rendered page URL to catch AI design tells with 62 deterministic rules and no model or API key.

- Treat exit code 2 as findings and exit code 1 as a target that could not be scanned.

## Iterate live in the browser

- Open live mode on your running dev server, select an element and cycle through variants until one fits, then accept it so the change is written back to your source.

- Use live mode only on a local checkout and never inject it into a deployed site or weaken a production CSP to make it work.

- Install the skill with npx impeccable install from your project root and reload your coding tool before the first command.

## Available connectors

- Use `muse.connector_search` to find other connectors and `muse.skill_search` to find related skills.

- If nothing here fits, look on the web for a maintained API or MCP server and set it up with [Custom Connectors and MCPs](/opt/muse/skills/custom-connector-setup/SKILL.md), or build a custom connector.

## Websites

- [Impeccable repository](https://github.com/pbakaus/impeccable) for the skill source, the 24 commands, the detector and the install steps. Carry the command and the target into the README and verify the command behavior there.

- [Impeccable docs](https://impeccable.style/docs) for one page per command, live mode and the detector. Carry the exact command name into the docs and verify its options before you run it.

## Alternatives for better results

- Point the skill at an interface that already exists first, because it is strongest when it reviews and iterates on real pages rather than building from a blank brief.

- Accept the design hook when the installer offers it, so the detector scans every UI file the agent edits before the work is called done.
