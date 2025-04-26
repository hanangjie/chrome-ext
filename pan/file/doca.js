const fs = require('fs');
const path = require('path');

// 配置输入输出路径
const inputDir = path.join(__dirname, 'ca');
const outputFile = path.join(__dirname, 'filtered_results.json');

// 主处理函数
function processFiles() {
    // 读取目录下所有.json文件
    const files = fs.readdirSync(inputDir)
        .filter(f => f.endsWith('.json'));

    // 处理所有文件
    const results = files.flatMap(file => {
        const filePath = path.join(inputDir, file);
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            return data.filter(item => (item.title.includes('.jpg') || item.title.includes('.JPG')) && item.detail === 'multi_file');
        } catch (e) {
            console.error(`处理文件 ${file} 时出错:`, e);
            return [];
        }
    });

    // 写入结果文件
    fs.writeFileSync(outputFile,
        JSON.stringify(results, null, 2),
        'utf-8'
    );
    console.log(`共找到 ${results.length} 条匹配数据，已保存到 ${outputFile}`);
}

// 执行处理
processFiles();