// export default function decorate(block) {
//   // Har row ek div hai, har cell ek div
//   const rows = [...block.children].map((row) =>
//     [...row.children].map((cell) => cell.textContent.trim()));

//   const ul = document.createElement('ul');
//   rows.forEach(([tenure, rate, tag]) => {
//     const li = document.createElement('li');
//     li.innerHTML = `
//       ${tag ? `<span class="rate-cards-tag">${tag}</span>` : ''}
//       <p class="rate-cards-tenure">${tenure}</p>
//       <p class="rate-cards-rate">${rate}</p>
//       <p class="rate-cards-label">p.a.</p>`;
//     ul.append(li);
//   });
//   block.replaceChildren(ul);
// }

export default async function decorate(block) {
  let rows;

  // 1) hyperlink ho to wahan se, 2) nahi to plain text mein ".json" wala path dhundo
  const link = block.querySelector('a[href$=".json"]');
  let path = link ? new URL(link.href).pathname : null;
  if (!path) {
    const match = block.textContent.match(/\S+\.json/);
    if (match) path = new URL(match[0], window.location.origin).pathname;
  }

  if (path) {
    const resp = await fetch(path);
    const { data } = await resp.json();
    rows = data.map((r) => [r.Tenure, r.Rate, r.Tag]);
  } else {
    rows = [...block.children]
      .map((row) => [...row.children].map((cell) => cell.textContent.trim()));
  }

  const ul = document.createElement('ul');
  rows.forEach(([tenure, rate, tag]) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${tag ? `<span class="rate-cards-tag">${tag}</span>` : ''}
      <p class="rate-cards-tenure">${tenure}</p>
      <p class="rate-cards-rate">${rate}</p>
      <p class="rate-cards-label">p.a.</p>`;
    ul.append(li);
  });
  block.replaceChildren(ul);
}
