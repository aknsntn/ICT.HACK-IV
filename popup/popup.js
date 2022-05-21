
let btn = document.querySelector('.switch');
let checkbox = document.getElementById('check')
btn.addEventListener('click', () => {
    chrome.storage.sync.set({value: checkbox.checked})
});

chrome.storage.sync.get({value: false}, (data) => {
    checkbox.checked = data.value
})


