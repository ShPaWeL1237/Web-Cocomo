document.addEventListener('DOMContentLoaded', () => {
    const earlyDesign = document.getElementById('earlyDesign');
    const postArchitecture = document.getElementById('postArchitecture');
    const effortMultipliersPA = document.getElementById('effortMultipliersPA');
    const effortMultipliers = document.getElementById('effortMultipliers');

    const loc = document.getElementById('kloc');
    const effort = document.getElementById('effort');
    const time = document.getElementById('time');

    earlyDesign.addEventListener('change', () => {
        effortMultipliersPA.style.display = 'none';
        effortMultipliers.style.display = 'block';
        updateResults();
    });
    postArchitecture.addEventListener('change', () => {
        effortMultipliersPA.style.display = 'block';
        effortMultipliers.style.display = 'none';
        updateResults();
    });

    // Recalculate whenever inputs change

    loc.addEventListener('input', updateResults);

    for (let i = 1; i <= 5; i++) {
        const dropdown = document.getElementById(`SF${i}`);
        if (dropdown) {
            dropdown.addEventListener('change', updateResults);
        }
    }
    for (let i = 1; i <= 7; i++) {
        const dropdown = document.getElementById(`EM${i}`);
        if (dropdown) {
            dropdown.addEventListener('change', updateResults);
        }
    }
    for (let i = 1; i <= 17; i++) {
        const dropdown = document.getElementById(`EMPA${i}`);
        if (dropdown) {
            dropdown.addEventListener('change', updateResults);
        }
    }


    function updateResults() {
        const model = earlyDesign.checked ? 'ED' : 'PA';
        const locValue = parseFloat(loc.value);

        if (isNaN(locValue) || locValue <= 0) {
            effort.innerHTML = `Трудоёмкость(человекомесяцев): <span class="fw-bold">N/A</span>`;
            time.innerHTML = `Время разработки (месяцев): <span class="fw-bold">N/A</span>`;
            return;
        }

        const SF = [];
        for (let i = 1; i <= 5; i++) {
            const dropdown = document.getElementById(`SF${i}`);
            const value = dropdown ? parseFloat(dropdown.value) : 1.0;
            SF.push(value);
        }
        const EMns = [];
        for (let i = 1; i <= 6; i++) {
            const dropdown = document.getElementById(`EM${i}`);
            const value = dropdown ? parseFloat(dropdown.value) : 1.0;
            EMns.push(value);
        }
        const EM = EMns;
        var dropdown = document.getElementById("EM7");
        var value = dropdown ? parseFloat(dropdown.value) : 1.0;
        EM.push(value);

        const EMPAns = [];
        for (let i = 1; i <= 16; i++) {
            const dropdown = document.getElementById(`EMPA${i}`);
            const value = dropdown ? parseFloat(dropdown.value) : 1.0;
            EMPAns.push(value);
        }
        const EMPA = EMPAns;
        var dropdown = document.getElementById("EMPA17");
        var value = dropdown ? parseFloat(dropdown.value) : 1.0;
        EMPA.push(value);
       

        const SCED = document.getElementById(earlyDesign.checked ? "EM7" : "EMPA17").value;
        const SSF = SF.reduce((acc, factor) => acc + factor, 0);
        const b = 0.91;
        const a = earlyDesign.checked ? 2.94 : 2.45;
        const c = 3.67;
        const d = 0.28;
        
        if(model == "ED"){
            const EAF = EM.reduce((acc, factor) => acc * factor, 1);
            const EAFns = EMns.reduce((acc, factor) => acc * factor, 1);
            const e = b + (0.01 * SSF);
            var PM = EAF * a * Math.pow(locValue, e);
            const PMns = EAFns * a * Math.pow(locValue, e);
            var TM = SCED * c * Math.pow(PMns, (d+0.2*(e-b)));
        }else{
            const EAF = EMPA.reduce((acc, factor) => acc * factor, 1);
            const EAFns = EMPAns.reduce((acc, factor) => acc * factor, 1);
            const e = b + (0.01 * SSF);
            var PM = EAF * a * Math.pow(locValue, e);
            const PMns = EAFns * a * Math.pow(locValue, e);
            var TM = SCED * c * Math.pow(PMns, (d+0.2*(e-b)));
        }


        // Update Results
        effort.innerHTML = `Трудоёмкость(человекомесяцев): <span class="fw-bold">${PM.toFixed(2)}</span>`;
        time.innerHTML = `Время разработки (месяцев): <span class="fw-bold">${TM.toFixed(2)}</span>`;
    }

    // Initial calculation
    updateResults();
});