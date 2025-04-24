const { pipeline } = require('stream/promises');
const { createWriteStream } = require('fs');
const crypto = require('crypto');

class HashGenerator {
    constructor() {
        // 字符集定义（与示例哈希匹配）
        this.charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        this.charLen = this.charSet.length;
    }

    // 流式生成器（网页5/7/8的流处理方案）
    async *generateStream(total, batchSize = 10000) {
        let count = 0;

        while (count < total) {
            const currentBatch = Math.min(batchSize, total - count);
            const batch = Array.from({ length: currentBatch }, () => this._generate());

            yield '[' + batch.map(hash => `"${hash}"`).join(',') + ']';
            count += currentBatch;

            // 进度报告（网页3的优化建议）
            if (count % (total / 10) === 0) {
                console.log(`生成进度: ${(count / total * 100).toFixed(1)}%`);
            }
        }
    }

    // 单字符串生成（网页2的安全随机方法）
    _generate(length = 7) {
        const bytes = crypto.randomBytes(length);
        let str = '';

        for (let i = 0; i < length; i++) {
            str += this.charSet[bytes[i] % this.charLen];
        }
        return str;
    }
}

// ================== 分文件写入器 ==================
async function main() {
    const generator = new HashGenerator();
    const total = 1_000_000;
    const batchPerFile = 9999;

    let fileIndex = 1;
    let currentCount = 0;

    // 动态创建文件流（网页6的背压处理）
    let writeStream = createWriteStream(`hashList/hash_${fileIndex}.json`, {
        highWaterMark: 64 * 1024 * 1024 // 64MB缓冲区
    });

    try {
        await pipeline(
            generator.generateStream(total),
            // 分文件写入逻辑
            async function* (source) {
                for await (const chunk of source) {
                    writeStream.write(chunk);
                    currentCount += (chunk.match(/,/g) || []).length;
                    if (currentCount >= batchPerFile) {
                        writeStream.end();
                        fileIndex++;
                        currentCount = 0;
                        writeStream = createWriteStream(`hashList/hash_${fileIndex}.json`, {
                            highWaterMark: 64 * 1024 * 1024
                        });
                    }
                }
                writeStream.end();
            }
        );

        console.log(`✅ 生成完成！共生成${fileIndex}个文件`);
    } catch (err) {
        console.error('生成失败:', err);
    }
}

main();