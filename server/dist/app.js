"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
app.use((req, res) => {
    const test = "Hallo Welt!";
    res.status(200).json({ message: test });
});
app.listen(3000, () => {
    console.log("Running at port 3000");
});
