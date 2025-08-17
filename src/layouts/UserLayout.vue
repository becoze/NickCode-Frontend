<template>
  <div id="userLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header"> user Login </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>

      <a-layout-footer class="footer">
        <a href="https://becoze.github.io/wiki" target="_blank"> Becoze </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#userLayout {
}

#userLayout .header {
  box-shadow: #eee 1px 1px 5px;
  height: 60px;
  margin: 5px;
}

#userLayout .content {
  background: linear-gradient(to right, #eee, #fff);
  margin-bottom: 16px;
  padding: 16px;
}

#userLayout .footer {
  padding: 16px;
  position: sticky;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script></script>
