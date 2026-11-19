import fs from "fs";
import path from "path";

const persistentTargets = [
    {
        envKey: "ALLOWED_EMAILS_FILE",
        defaultContent: "# Add one email address per line\n"
    },
    {
        envKey: "GAME_PRESETS_FILE",
        defaultContent: "[]\n"
    }
];

export function ensurePersistentFiles() {
    persistentTargets.forEach(function ensureFile(target) {
        const configuredPath = process.env[target.envKey];

        if (!configuredPath || typeof configuredPath !== "string") {
            return;
        }

        const trimmedPath = configuredPath.trim();

        if (!trimmedPath) {
            return;
        }

        const resolvedPath = path.resolve(trimmedPath);
        const directory = path.dirname(resolvedPath);

        createDirectoryIfMissing(directory);
        createFileIfMissing(resolvedPath, target.defaultContent);
    });
}

function createDirectoryIfMissing(directoryPath) {
    if (fs.existsSync(directoryPath)) {
        return;
    }

    try {
        fs.mkdirSync(directoryPath, { recursive: true });
    } catch (error) {
        console.error("Unable to create directory", directoryPath, error.message);
    }
}

function createFileIfMissing(filePath, defaultContent) {
    if (fs.existsSync(filePath)) {
        return;
    }

    try {
        fs.writeFileSync(filePath, defaultContent, "utf-8");
        console.log("Persistent file created", filePath);
    } catch (error) {
        console.error("Unable to create persistent file", filePath, error.message);
    }
}
