<html lang="en">

<head>
  <style>
    .container {
      padding: 120px 0px;
      text-align: center;
    }

    .container h3 {
      margin-bottom: 2rem;
      font-size: 1.5rem;
    }

    .google-search {
      margin-bottom: 2rem;
    }

    .unavailable-url {
      font-size: 1.5rem;
    }

    .unavailable-url,
    .broken-logo {
      margin-bottom: 3rem;
    }

    .google-search,
    .wayback-search {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #6D9D31;
      font-weight: 400;
      text-decoration: none;
      font-size: 1.5rem;
      cursor: pointer;
    }
  </style>

<body>
  <div class='container'>
    <h1 aria-label="empty"></h1>
    <h2 id='not-available' class='unavailable-url'></h2>
    <div class='broken-logo'>
      <img src="/images/global/report.svg" aria-label="broken-logo">
    </div>
    <h3>This link no longer exists. Sorry about that!</h3>
    <h4 style="font-size:1.5em">Check the page address or try searching Google for this URL.</h4>
    <a class='google-search'>Search this URL on Google
      <img src='/images/global/double_arrow.svg' aria-label="double_arrow">
    </a>
    <div id="wayback" style="display:none">
      <a id="wayback-link" class='wayback-search'>View on the Wayback Machine
        <img src='/images/global/double_arrow.svg' aria-label="double_arrow">
      </a>
    </div>
  </div>
</body>
</head>

</html>

<script>
  let address = new URL(document.location.href);
  let params = new URLSearchParams(address.search);
  const deadLink = params.get('url');
  document.getElementById('not-available').innerText = `${deadLink}`
  document.querySelector('.google-search').addEventListener('click', () => {
    location.href = `https://www.google.com/search?q=${encodeURIComponent(deadLink)}`
  });

  function addWayBackLink(link) {
    document.getElementById('wayback-link').addEventListener('click', () => {
      location.href = link;
    })
    document.getElementById('wayback').style.display = 'block';
  }

  (async () => {
    const json = await fetch(`https://archive.org/wayback/available?url=${deadLink}`).then(r => r.json());
    const entry = json.archived_snapshots.closest;
    if (entry) {
      addWayBackLink(entry.url);
    }
  })();
</script>
