# SecretManager

Use SecretManager to keep all of your project's secrets in a single gitignored file. This one set of secrets will be injected across all of your project's config files.

## Installation

Make sure node.js is installed on your system. Copy `secretmanager.js` to anywhere on your filesystem. Then add a script that executes `secretmanager.js`, and make sure that script is on your system's `PATH`.

For windows, see `sm.bat` as an example script.

## Usage

Create a `.sm.json` file in your project's root.

See `example/.sm.json` as an example:

```json
{
  "replacements": [
    {
      "source": "configs1",
      "targets": [
        {
          "secret": "secrets/s1.json",
          "out": "generated/s1"
        },
        {
          "secret": "secrets/s2.json",
          "out": "generated/s2"
        }
      ]
    }
  ]
}
```

`source`, `secret`, and `out` are paths relative to your project's root.

For each target, all files and directories from `source` will recursively be copied to the target's `out`. The content of each file will be modified based on the key-value pairs in the target's `secret` file.

See `example/secrets/s1.json`

```json
{
  "ADMIN_PASSWORD": "s1_admin_password",
  "CFG2_SECRET": "s1_secret"
}
```

Given the above secrets, the following replacements will be made in each source file:

- `{ADMIN_PASSWORD}` --> `s1_admin_password`
- `{CFG2_SECRET}` --> `s1_secret`

## Running

From your project's root, execute the script that runs `secretmanager.js`. The script will look for a `.sm.json` file in the current working directory and generate files accordingly.
