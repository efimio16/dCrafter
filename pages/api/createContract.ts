import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { erc721Template } from "../../lib/templates/erc721";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import os from "os";

const contractSchema = z.object({
    name: z.string().min(1, "Name is required"),
    symbol: z.string().min(1, "Symbol is required"),
    baseURI: z.string().url("baseURI must be a valid URL"),
    royaltyReceiver: z.string().min(1, "Royalty receiver is required"),
    royaltyFee: z
        .number()
        .int()
        .min(0, "Royalty cannot be negative")
        .max(10000, "Royalty cannot exceed 10000"),
    supply: z
        .number()
        .int()
        .positive("Supply must be > 0")
        .refine((v) => Number.isFinite(v), "Supply must be a finite number"),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { name, symbol, baseURI, royaltyReceiver, royaltyFee, supply } = contractSchema.parse(req.body);

        const source = erc721Template(name, symbol, baseURI, royaltyReceiver, royaltyFee, supply);

        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "solc-"));
        const tmpFile = path.join(tmpDir, "CustomNFT.sol");
        fs.writeFileSync(tmpFile, source, "utf8");

        const OZ_DIR = path.resolve("node_modules/@openzeppelin/contracts");

        const BASE_DIR = path.resolve("node_modules");
        const cmd = `solc --base-path ${BASE_DIR} --allow-paths ${tmpDir},${OZ_DIR} --combined-json abi,bin ${tmpFile}`;

        const outputJSON = execSync(cmd, { stdio: "pipe" }).toString();
        const output = JSON.parse(outputJSON);

        const contractKey = Object.keys(output.contracts)[0];
        const contract = output.contracts[contractKey];

        fs.rmSync(tmpDir, { recursive: true, force: true });

        return res.json({
            abi: contract.abi,
            bytecode: contract.bin,
            source,
        });

    } catch (err) {
        if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors });
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
