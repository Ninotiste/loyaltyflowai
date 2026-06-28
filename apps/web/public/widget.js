;(function () {
  'use strict'

  var BASE_URL = ''
  var SESSION_KEY = 'lf_widget_token'

  // ---------------------------------------------------------------------------
  // Bootstrap — find script tag, extract public key + base URL
  // ---------------------------------------------------------------------------
  function init() {
    var scripts = document.querySelectorAll('script[data-public-key]')
    var scriptTag = scripts[scripts.length - 1]
    if (!scriptTag) return

    var publicKey = scriptTag.getAttribute('data-public-key')
    BASE_URL = scriptTag.getAttribute('data-base-url') || (location.protocol + '//' + location.host)

    if (!publicKey) {
      console.warn('[LoyaltyFlow] Missing data-public-key attribute')
      return
    }

    injectStyles()
    var container = createContainer()
    var token = sessionStorage.getItem(SESSION_KEY)

    if (token) {
      fetchStatus(token, publicKey, container)
    } else {
      renderRegisterPanel(publicKey, container)
    }
  }

  // ---------------------------------------------------------------------------
  // Shadow DOM container
  // ---------------------------------------------------------------------------
  function createContainer() {
    var host = document.createElement('div')
    host.id = 'lf-widget-host'
    host.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99999;font-family:system-ui,-apple-system,sans-serif'
    document.body.appendChild(host)

    var shadow = host.attachShadow({ mode: 'open' })

    var style = document.createElement('style')
    style.textContent = getShadowStyles()
    shadow.appendChild(style)

    return shadow
  }

  // ---------------------------------------------------------------------------
  // API helpers
  // ---------------------------------------------------------------------------
  function post(path, body, token) {
    var headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = 'Bearer ' + token
    return fetch(BASE_URL + path, { method: 'POST', headers: headers, body: JSON.stringify(body) })
      .then(function (r) { return r.json() })
  }

  function get(path, token) {
    var headers = {}
    if (token) headers['Authorization'] = 'Bearer ' + token
    return fetch(BASE_URL + path, { headers: headers }).then(function (r) { return r.json() })
  }

  // ---------------------------------------------------------------------------
  // Fetch status (logged-in customer)
  // ---------------------------------------------------------------------------
  function fetchStatus(token, publicKey, shadow) {
    get('/api/v1/widget/status', token)
      .then(function (data) {
        if (data.error) {
          sessionStorage.removeItem(SESSION_KEY)
          renderRegisterPanel(publicKey, shadow)
        } else {
          renderCardPanel(data, token, shadow)
        }
      })
      .catch(function () { renderRegisterPanel(publicKey, shadow) })
  }

  // ---------------------------------------------------------------------------
  // Panels
  // ---------------------------------------------------------------------------
  function renderToggleButton(shadow, label, onClick) {
    var btn = shadow.querySelector('#lf-toggle')
    if (!btn) {
      btn = document.createElement('button')
      btn.id = 'lf-toggle'
      btn.className = 'lf-btn-primary lf-round'
      shadow.appendChild(btn)
    }
    btn.textContent = label
    btn.onclick = onClick
    return btn
  }

  function renderRegisterPanel(publicKey, shadow) {
    clearPanel(shadow)
    var panel = createPanel(shadow)

    var btn = renderToggleButton(shadow, 'Mes points 🎁', function () {
      togglePanel(panel)
    })

    panel.innerHTML = [
      '<h3 class="lf-title">Rejoindre le programme</h3>',
      '<p class="lf-sub">Gagnez des points à chaque visite !</p>',
      '<input id="lf-email" class="lf-input" type="email" placeholder="votre@email.fr" required>',
      '<input id="lf-firstname" class="lf-input" type="text" placeholder="Prénom (optionnel)">',
      '<label class="lf-consent"><input id="lf-consent" type="checkbox"> J\'accepte que mes données soient utilisées pour ce programme de fidélité.</label>',
      '<button id="lf-register" class="lf-btn-primary lf-block">S\'inscrire gratuitement</button>',
      '<p id="lf-error" class="lf-error" style="display:none"></p>',
      '<p class="lf-footer">Déjà inscrit ? <button id="lf-identify" class="lf-link">Se connecter</button></p>',
    ].join('')

    shadow.querySelector('#lf-register').onclick = function () {
      var email = (shadow.querySelector('#lf-email').value || '').trim().toLowerCase().slice(0, 254)
      var firstName = (shadow.querySelector('#lf-firstname').value || '').trim().replace(/[<>&"'\\]/g, '').slice(0, 100)
      var consent = shadow.querySelector('#lf-consent').checked
      var errEl = shadow.querySelector('#lf-error')

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError(errEl, 'Email invalide'); return }
      if (!consent) { showError(errEl, 'Veuillez accepter les conditions'); return }

      post('/api/v1/widget/register', { email: email, first_name: firstName || undefined, public_key: publicKey, consent: true })
        .then(function (data) {
          if (data.error) { showError(errEl, data.error.message); return }
          sessionStorage.setItem(SESSION_KEY, data.token)
          fetchStatus(data.token, publicKey, shadow)
        })
    }

    shadow.querySelector('#lf-identify').onclick = function () {
      renderIdentifyPanel(publicKey, shadow)
    }
  }

  function renderIdentifyPanel(publicKey, shadow) {
    clearPanel(shadow)
    var panel = createPanel(shadow)

    renderToggleButton(shadow, 'Mes points 🎁', function () { togglePanel(panel) })

    panel.innerHTML = [
      '<h3 class="lf-title">Se connecter</h3>',
      '<input id="lf-email" class="lf-input" type="email" placeholder="votre@email.fr" required>',
      '<button id="lf-login" class="lf-btn-primary lf-block">Voir mes points</button>',
      '<p id="lf-error" class="lf-error" style="display:none"></p>',
      '<p class="lf-footer"><button id="lf-back" class="lf-link">← Retour</button></p>',
    ].join('')

    shadow.querySelector('#lf-login').onclick = function () {
      var email = (shadow.querySelector('#lf-email').value || '').trim().toLowerCase().slice(0, 254)
      var errEl = shadow.querySelector('#lf-error')

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError(errEl, 'Email invalide'); return }

      post('/api/v1/widget/identify', { email: email, public_key: publicKey })
        .then(function (data) {
          if (data.error) { showError(errEl, 'Compte non trouvé. Inscrivez-vous !'); return }
          sessionStorage.setItem(SESSION_KEY, data.token)
          fetchStatus(data.token, publicKey, shadow)
        })
    }

    shadow.querySelector('#lf-back').onclick = function () { renderRegisterPanel(publicKey, shadow) }
  }

  function renderCardPanel(data, token, shadow) {
    clearPanel(shadow)
    var panel = createPanel(shadow)

    renderToggleButton(shadow, 'Mes points 🎁', function () { togglePanel(panel) })

    var nextReward = data.next_reward
    var progressPct = nextReward ? Math.min(100, Math.round((data.points / nextReward.points_required) * 100)) : 100
    var availableRewards = data.available_rewards || []

    var rewardsHtml = availableRewards.length > 0
      ? availableRewards.map(function (r) {
          return '<button class="lf-reward-btn" data-id="' + r.id + '">' + r.name + ' (' + r.points_required + ' pts)</button>'
        }).join('')
      : ''

    panel.innerHTML = [
      '<h3 class="lf-title">Bonjour ' + (data.customer.first_name || '') + ' !</h3>',
      '<div class="lf-points-big">' + data.points + ' <span class="lf-pts-label">points</span></div>',
      nextReward ? [
        '<div class="lf-progress-bar"><div class="lf-progress-fill" style="width:' + progressPct + '%"></div></div>',
        '<p class="lf-progress-text">Encore ' + (nextReward.points_required - data.points) + ' pts pour : ' + nextReward.name + '</p>',
      ].join('') : '<p class="lf-progress-text">Toutes les récompenses sont débloquées !</p>',
      rewardsHtml ? '<div class="lf-rewards"><h4>Mes récompenses</h4>' + rewardsHtml + '</div>' : '',
      '<p id="lf-redeem-msg" class="lf-success" style="display:none"></p>',
      '<p id="lf-error" class="lf-error" style="display:none"></p>',
      '<p class="lf-footer"><button id="lf-logout" class="lf-link">Se déconnecter</button></p>',
    ].join('')

    shadow.querySelectorAll('.lf-reward-btn').forEach(function (btn) {
      btn.onclick = function () {
        var rewardId = btn.getAttribute('data-id')
        post('/api/v1/widget/redeem', { reward_id: rewardId }, token)
          .then(function (data) {
            var msgEl = shadow.querySelector('#lf-redeem-msg')
            var errEl = shadow.querySelector('#lf-error')
            if (data.error) { showError(errEl, data.error.message); return }
            msgEl.textContent = 'Code : ' + data.code + ' (valable 24h — présentez ce code au restaurant)'
            msgEl.style.display = 'block'
            btn.disabled = true
          })
      }
    })

    shadow.querySelector('#lf-logout').onclick = function () {
      sessionStorage.removeItem(SESSION_KEY)
      renderRegisterPanel(null, shadow)
    }
  }

  // ---------------------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------------------
  function createPanel(shadow) {
    var existing = shadow.querySelector('#lf-panel')
    if (existing) existing.remove()
    var panel = document.createElement('div')
    panel.id = 'lf-panel'
    panel.className = 'lf-panel'
    panel.style.display = 'none'
    shadow.appendChild(panel)
    return panel
  }

  function clearPanel(shadow) {
    var panel = shadow.querySelector('#lf-panel')
    if (panel) panel.remove()
  }

  function togglePanel(panel) {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none'
  }

  function showError(el, msg) {
    el.textContent = msg
    el.style.display = 'block'
  }

  function injectStyles() {}

  function getShadowStyles() {
    return [
      '.lf-btn-primary{background:#0284c7;color:#fff;border:none;border-radius:8px;padding:10px 18px;cursor:pointer;font-size:14px;font-weight:600}',
      '.lf-btn-primary:hover{background:#0369a1}',
      '.lf-round{border-radius:24px;padding:10px 20px}',
      '.lf-block{width:100%;margin-top:8px}',
      '.lf-panel{background:#fff;border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,0.15);padding:20px;width:280px;position:absolute;bottom:52px;right:0}',
      '.lf-title{margin:0 0 4px;font-size:16px;font-weight:700;color:#111}',
      '.lf-sub{margin:0 0 12px;font-size:13px;color:#666}',
      '.lf-input{width:100%;box-sizing:border-box;border:1px solid #d1d5db;border-radius:8px;padding:8px 12px;font-size:13px;margin-bottom:8px}',
      '.lf-consent{font-size:12px;color:#555;display:flex;gap:6px;align-items:flex-start;margin-bottom:8px}',
      '.lf-consent input{margin-top:2px}',
      '.lf-footer{font-size:12px;color:#888;margin-top:12px;text-align:center}',
      '.lf-link{background:none;border:none;color:#0284c7;cursor:pointer;font-size:12px;padding:0;text-decoration:underline}',
      '.lf-error{color:#dc2626;font-size:12px;margin-top:4px}',
      '.lf-success{color:#16a34a;font-size:12px;margin-top:4px;font-weight:600;word-break:break-all}',
      '.lf-points-big{font-size:36px;font-weight:800;color:#0284c7;text-align:center;margin:8px 0}',
      '.lf-pts-label{font-size:14px;font-weight:400;color:#666}',
      '.lf-progress-bar{background:#e5e7eb;border-radius:99px;height:8px;overflow:hidden;margin:8px 0 4px}',
      '.lf-progress-fill{background:#0284c7;height:100%;border-radius:99px;transition:width 0.5s}',
      '.lf-progress-text{font-size:12px;color:#555;text-align:center;margin:0 0 8px}',
      '.lf-rewards{margin-top:8px}',
      '.lf-rewards h4{font-size:12px;font-weight:600;color:#444;margin:0 0 6px}',
      '.lf-reward-btn{background:#f0f9ff;border:1px solid #0284c7;color:#0284c7;border-radius:8px;padding:6px 12px;font-size:12px;cursor:pointer;width:100%;margin-bottom:4px;text-align:left}',
      '.lf-reward-btn:hover{background:#e0f2fe}',
      '.lf-reward-btn:disabled{opacity:0.5;cursor:not-allowed}',
    ].join('')
  }

  // ---------------------------------------------------------------------------
  // Start
  // ---------------------------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
