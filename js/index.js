document.addEventListener('DOMContentLoaded', () => {
    const basicModel = document.getElementById('basicModel');
    const intermediateModel = document.getElementById('intermediateModel');
    const intermediateParams = document.getElementById('intermediateParams');
    const projectType = document.getElementById('projectType');
    const loc = document.getElementById('kloc');
    const effort = document.getElementById('effort');
    const time = document.getElementById('time');


    // Toggle visibility of Intermediate parameters
    basicModel.addEventListener('change', () => {
        intermediateParams.style.display = 'none';
        updateResults();
    });
    intermediateModel.addEventListener('change', () => {
        intermediateParams.style.display = 'block';
        updateResults();
    });

    // Recalculate whenever inputs change
    projectType.addEventListener('change', updateResults);
    loc.addEventListener('input', updateResults);

    for (let i = 1; i <= 15; i++) {
        const dropdown = document.getElementById(`AF${i}`);
        if (dropdown) {
            dropdown.addEventListener('change', updateResults);
        }
    }

    function updateResults() {
        const model = basicModel.checked ? 'Basic' : 'Intermediate';
        const type = projectType.value;
        const locValue = parseFloat(loc.value);

        if (isNaN(locValue) || locValue <= 0) {
            effort.innerHTML = `Трудоёмкость(человекомесяцев): <span class="fw-bold">N/A</span>`;
            time.innerHTML = `Время разработки (месяцев): <span class="fw-bold">N/A</span>`;
            return;
        }
        const AF = [];
        for (let i = 1; i <= 15; i++) {
            const dropdown = document.getElementById(`AF${i}`);
            const value = dropdown ? parseFloat(dropdown.value) : 1.0; // Значение по умолчанию 1.0
            AF.push(value);
        }

        // Пример: Умножаем все значения факторов на усилие
        

        const typeCoefficients = {
            organic: { a: 2.4, b: 1.05, c:2.5, d:0.38 },
            'semi-detached': { a: 3.0, b: 1.12, c:2.5, d:0.35 },
            embedded: { a: 3.6, b: 1.20, c:2.5, d:0.32 },
        };
        if(model == 'Basic'){
            const { a, b, c, d } = typeCoefficients[type];
            var PM = a * Math.pow(locValue, b);
            var TM = c * Math.pow(PM, d);
        }else{
            const EAF = AF.reduce((acc, factor) => acc * factor, 1);
            const { a, b, c, d } = typeCoefficients[type];
            var PM = EAF * a * Math.pow(locValue, b);
            var TM = c * Math.pow(PM, d);
        }


        // Update Results
        effort.innerHTML = `Трудоёмкость(человекомесяцев): <span class="fw-bold">${PM.toFixed(2)}</span>`;
        time.innerHTML = `Время разработки (месяцев): <span class="fw-bold">${TM.toFixed(2)}</span>`;
    }

    // Initial calculation
    updateResults();
});