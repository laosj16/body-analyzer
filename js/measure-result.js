const allMetrics = {
    core: {
        title: 'Core Metrics',
        items: [ { id: 'weight', label: 'Weight', unit: 'kg' }, { id: 'heart_rate', label: 'Heart Rate', unit: 'bpm' }, { id: 'bmr', label: 'BMR', unit: 'kcal' }, { id: 'bmi', label: 'BMI', unit: '' }, { id: 'body_fat_rate', label: 'Body Fat Rate', unit: '%' }, { id: 'fat_mass', label: 'Fat Mass', unit: 'kg' }, { id: 'muscle_rate', label: 'Muscle Rate', unit: '%' }, { id: 'muscle_mass', label: 'Muscle Mass', unit: 'kg' }, { id: 'protein_rate', label: 'Protein Rate', unit: '%' }, { id: 'protein_mass', label: 'Protein Mass', unit: 'kg' }, { id: 'body_water_rate', label: 'Body Water Rate', unit: '%' }, { id: 'body_water_mass', label: 'Body Water Mass', unit: 'kg' }, { id: 'subcutaneous_fat_rate', label: 'Subcutaneous Fat Rate', unit: '%' }, { id: 'subcutaneous_fat_mass', label: 'Subcutaneous Fat Mass', unit: 'kg' }, { id: 'visceral_fat', label: 'Visceral Fat', unit: 'Level' }, { id: 'bone_mass', label: 'Bone Mass', unit: 'kg' }, ]
    },
    composition: {
        title: 'Body Composition',
        items: [ { id: 'intracellular_water', label: 'Intracellular Water', unit: 'kg' }, { id: 'extracellular_water', label: 'Extracellular Water', unit: 'kg' }, { id: 'skeletal_muscle_rate', label: 'Skeletal Muscle Rate', unit: '%' }, { id: 'skeletal_muscle_mass', label: 'Skeletal Muscle Mass', unit: 'kg' }, { id: 'lean_body_mass', label: 'Lean Body Mass', unit: 'kg' }, { id: 'inorganic_salt', label: 'Inorganic Salt', unit: 'kg' }, { id: 'body_cell_mass', label: 'Body Cell Mass', unit: 'kg' }, { id: 'smi', label: 'Skeletal Muscle Index', unit: '' }, ]
    },
    segmental: {
        title: 'Segmental Analysis',
        items: [ { id: 'left_arm_fat_mass', label: 'Left Arm Fat', unit: 'kg' }, { id: 'right_arm_fat_mass', label: 'Right Arm Fat', unit: 'kg' }, { id: 'left_arm_muscle_mass', label: 'Left Arm Muscle', unit: 'kg' }, { id: 'right_arm_muscle_mass', label: 'Right Arm Muscle', unit: 'kg' }, { id: 'left_leg_fat_mass', label: 'Left Leg Fat', unit: 'kg' }, { id: 'right_leg_fat_mass', label: 'Right Leg Fat', unit: 'kg' }, { id: 'left_leg_muscle_mass', label: 'Left Leg Muscle', unit: 'kg' }, { id: 'right_leg_muscle_mass', label: 'Right Leg Muscle', unit: 'kg' }, { id: 'trunk_fat_mass', label: 'Trunk Fat', unit: 'kg' }, { id: 'trunk_muscle_mass', label: 'Trunk Muscle', unit: 'kg' }, ]
    },
    evaluation: {
        title: 'Health Evaluation',
        items: [ { id: 'obesity_degree', label: 'Obesity Degree', unit: '' }, { id: 'fat_control', label: 'Fat Control', unit: 'kg' }, { id: 'muscle_control', label: 'Muscle Control', unit: 'kg' }, { id: 'weight_control', label: 'Weight Control', unit: 'kg' }, { id: 'standard_weight', label: 'Standard Weight', unit: 'kg' }, { id: 'body_age', label: 'Body Age', unit: 'years' }, { id: 'health_evaluation', label: 'Health Evaluation', unit: '' }, { id: 'whr', label: 'WHR (Waist-Hip Ratio)', unit: '' }, { id: 'recommended_calories', label: 'Recommended Calories', unit: 'kcal' }, ]
    }
};

function goBack() { window.location.href = 'main.html'; }
function goToIndex() { window.location.href = 'index.html'; }
function measureAgain() { window.location.href = 'Preparation.html'; }
function generateReport() { window.location.href = 'report.html'; }
function saveResult() { alert('Measurement saved!'); window.location.href = 'main.html'; }
function deleteResult() { if (confirm('Are you sure you want to delete this measurement?')) { alert('Measurement deleted!'); window.location.href = 'main.html'; } }

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
            data.obesity_degree = 'Normal';
            data.body_type = 'Standard Muscular';
            data.health_evaluation = 'Good';
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
                document.getElementById('current-user-name').textContent = 'Guest';
                data = generateMeasurementResults();
            }

    populateData(data);
};
