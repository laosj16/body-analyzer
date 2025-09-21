const allMetrics = {
    core: {
        title: '核心指标',
        items: [ { id: 'weight', label: '体重', unit: 'kg' }, { id: 'heart_rate', label: '心率', unit: 'bpm' }, { id: 'bmr', label: 'BMR', unit: 'kcal' }, { id: 'bmi', label: 'BMI', unit: '' }, { id: 'body_fat_rate', label: '体脂率', unit: '%' }, { id: 'fat_mass', label: '脂肪量', unit: 'kg' }, { id: 'muscle_rate', label: '肌肉率', unit: '%' }, { id: 'muscle_mass', label: '肌肉量', unit: 'kg' }, { id: 'protein_rate', label: '蛋白质率', unit: '%' }, { id: 'protein_mass', label: '蛋白质量', unit: 'kg' }, { id: 'body_water_rate', label: '水分率', unit: '%' }, { id: 'body_water_mass', label: '体水分量', unit: 'kg' }, { id: 'subcutaneous_fat_rate', label: '皮下脂肪率', unit: '%' }, { id: 'subcutaneous_fat_mass', label: '皮下脂肪量', unit: 'kg' }, { id: 'visceral_fat', label: '内脏脂肪', unit: '等级' }, { id: 'bone_mass', label: '骨量', unit: 'kg' }, ]
    },
    composition: {
        title: '身体成分',
        items: [ { id: 'intracellular_water', label: '细胞内水量', unit: 'kg' }, { id: 'extracellular_water', label: '细胞外水量', unit: 'kg' }, { id: 'skeletal_muscle_rate', label: '骨骼肌率', unit: '%' }, { id: 'skeletal_muscle_mass', label: '骨骼肌量', unit: 'kg' }, { id: 'lean_body_mass', label: '去脂体重', unit: 'kg' }, { id: 'inorganic_salt', label: '无机盐量', unit: 'kg' }, { id: 'body_cell_mass', label: '身体细胞量', unit: 'kg' }, { id: 'smi', label: '骨骼肌质量指数', unit: '' }, ]
    },
    segmental: {
        title: '部位分析',
        items: [ { id: 'left_arm_fat_mass', label: '左臂脂肪', unit: 'kg' }, { id: 'right_arm_fat_mass', label: '右臂脂肪', unit: 'kg' }, { id: 'left_arm_muscle_mass', label: '左臂肌肉', unit: 'kg' }, { id: 'right_arm_muscle_mass', label: '右臂肌肉', unit: 'kg' }, { id: 'left_leg_fat_mass', label: '左腿脂肪', unit: 'kg' }, { id: 'right_leg_fat_mass', label: '右腿脂肪', unit: 'kg' }, { id: 'left_leg_muscle_mass', label: '左腿肌肉', unit: 'kg' }, { id: 'right_leg_muscle_mass', label: '右腿肌肉', unit: 'kg' }, { id: 'trunk_fat_mass', label: '躯干脂肪', unit: 'kg' }, { id: 'trunk_muscle_mass', label: '躯干肌肉', unit: 'kg' }, ]
    },
    evaluation: {
        title: '健康评估',
        items: [ { id: 'obesity_degree', label: '肥胖等级', unit: '' }, { id: 'fat_control', label: '脂肪控制', unit: 'kg' }, { id: 'muscle_control', label: '肌肉控制', unit: 'kg' }, { id: 'weight_control', label: '体重控制', unit: 'kg' }, { id: 'standard_weight', label: '标准体重', unit: 'kg' }, { id: 'body_age', label: '身体年龄', unit: '岁' }, { id: 'health_evaluation', label: '健康评价', unit: '' }, { id: 'whr', label: '推测腰臀比', unit: '' }, { id: 'recommended_calories', label: '建议卡路里', unit: 'kcal' }, ]
    }
};

function goBack() { window.location.href = 'main.html'; }
function goToIndex() { window.location.href = 'index.html'; }
function measureAgain() { window.location.href = 'measure-guide.html'; }
function generateReport() { window.location.href = 'report.html'; }
function saveResult() { alert('测量结果已保存！'); window.location.href = 'main.html'; }
function deleteResult() { if (confirm('确定要删除这次测量结果吗？')) { alert('测量结果已删除！'); window.location.href = 'main.html'; } }

function updateTime() {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const timeElement = document.getElementById('current-time');
    if (timeElement) timeElement.textContent = timeString;
}

function generateMeasurementResults(userData = null) {
    const data = {};
    const weight = userData ? parseFloat(userData.weight) : (Math.random() * 30 + 50);
    const height = 1.75;

    data.weight = weight.toFixed(1);
    data.bmi = (weight / (height * height)).toFixed(1);
    data.body_fat_rate = (Math.random() * 15 + 10).toFixed(1);
    data.fat_mass = (weight * data.body_fat_rate / 100).toFixed(1);
    data.lean_body_mass = (weight - data.fat_mass).toFixed(1);
    data.muscle_rate = ((data.lean_body_mass * 0.75) / weight * 100).toFixed(1);
    data.muscle_mass = (data.lean_body_mass * 0.75).toFixed(1);
    data.body_water_mass = (data.lean_body_mass * 0.73).toFixed(1);
    data.body_water_rate = (data.body_water_mass / weight * 100).toFixed(1);
    data.protein_mass = (data.muscle_mass * 0.2).toFixed(1);
    data.protein_rate = (data.protein_mass / weight * 100).toFixed(1);
    data.bone_mass = (data.lean_body_mass * 0.05).toFixed(1);
    data.inorganic_salt = (data.lean_body_mass * 0.05).toFixed(1);
    data.skeletal_muscle_mass = (data.muscle_mass * 0.55).toFixed(1);
    data.skeletal_muscle_rate = (data.skeletal_muscle_mass / weight * 100).toFixed(1);
    data.heart_rate = Math.floor(Math.random() * 20 + 65);
    data.bmr = Math.floor(10 * weight + 6.25 * (height * 100) - 5 * 30 + 5);
    data.subcutaneous_fat_rate = (data.body_fat_rate * 0.8).toFixed(1);
    data.subcutaneous_fat_mass = (data.fat_mass * 0.8).toFixed(1);
    data.trunk_fat_mass = (data.fat_mass * 0.5).toFixed(1);
    data.left_arm_fat_mass = (data.fat_mass * 0.07).toFixed(1);
    data.right_arm_fat_mass = (data.fat_mass * 0.08).toFixed(1);
    data.left_leg_fat_mass = (data.fat_mass * 0.17).toFixed(1);
    data.right_leg_fat_mass = (data.fat_mass * 0.18).toFixed(1);
    data.trunk_muscle_mass = (data.muscle_mass * 0.5).toFixed(1);
    data.left_arm_muscle_mass = (data.muscle_mass * 0.1).toFixed(1);
    data.right_arm_muscle_mass = (data.muscle_mass * 0.1).toFixed(1);
    data.left_leg_muscle_mass = (data.muscle_mass * 0.15).toFixed(1);
    data.right_leg_muscle_mass = (data.muscle_mass * 0.15).toFixed(1);
    data.extracellular_water = (data.body_water_mass * 0.4).toFixed(1);
    data.intracellular_water = (data.body_water_mass * 0.6).toFixed(1);
    data.health_score = Math.floor(Math.random() * 15 + 80);
    data.body_age = Math.floor(Math.random() * 10 + 25);
    data.visceral_fat = Math.floor(Math.random() * 5 + 3);
    data.smi = (data.skeletal_muscle_mass / (height * height)).toFixed(2);
    data.body_cell_mass = (data.protein_mass * 4).toFixed(1);
    data.whr = (0.8 + Math.random() * 0.1).toFixed(2);
    data.recommended_calories = data.bmr + 300;
    const idealBmi = 22;
    data.ideal_weight = (idealBmi * height * height).toFixed(1);
    data.standard_weight = data.ideal_weight;
    data.weight_control = (weight - data.ideal_weight).toFixed(1);
    data.fat_control = (data.fat_mass - (data.ideal_weight * 0.18)).toFixed(1);
    data.muscle_control = ((data.ideal_weight * 0.4) - data.muscle_mass).toFixed(1);
    data.obesity_degree = '正常';
    data.body_type = '标准肌肉型';
    data.health_evaluation = '良好';
    return data;
}

function populateData(results) {
    // 填充摘要卡
    document.getElementById('summary-score').textContent = results.health_score;
    document.getElementById('summary-body-type').textContent = results.body_type;
    document.getElementById('summary-weight').textContent = results.weight;
    document.getElementById('summary-bmi').textContent = results.bmi;

    // 动态创建数据列表
    const container = document.getElementById('data-sections-container');
    container.innerHTML = ''; // 清空旧内容

    for (const categoryKey in allMetrics) {
        const category = allMetrics[categoryKey];
        
        // 创建 section 容器
        const sectionEl = document.createElement('div');
        sectionEl.className = 'data-section';
        
        // 创建标题
        const titleEl = document.createElement('h2');
        titleEl.className = 'section-title';
        titleEl.textContent = category.title;
        sectionEl.appendChild(titleEl);

        // 创建列表容器
        const listEl = document.createElement('div');
        listEl.className = 'data-list';

        // 填充列表项
        category.items.forEach(metric => {
            const value = results[metric.id] !== undefined ? results[metric.id] : '--';
            const itemEl = document.createElement('div');
            itemEl.className = 'data-item';
            itemEl.innerHTML = `
                <span class="label">${metric.label}</span>
                <span class="value">${value}<span class="unit">${metric.unit}</span></span>
            `;
            listEl.appendChild(itemEl);
        });

        sectionEl.appendChild(listEl);
        container.appendChild(sectionEl);
    }
}

window.onload = function() {
    updateTime();
    setInterval(updateTime, 60000);

    const measurementData = localStorage.getItem('currentMeasurement');
    let data;
    if (measurementData) {
        const parsedData = JSON.parse(measurementData);
        document.getElementById('current-user-name').textContent = parsedData.user;
        data = generateMeasurementResults(parsedData);
    } else {
        document.getElementById('current-user-name').textContent = '访客';
        data = generateMeasurementResults();
    }

    populateData(data);
};
