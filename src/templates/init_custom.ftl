<#-- Project Prefix -->
<#assign prefix = "gs" />

<#-- Project Specific Variables -->
<#assign is_private_page = !layout.isPublicLayout() />

<#--  Theme settings  -->
<#assign show_breadcrumbs = getterUtil.getBoolean(theme_settings["show-breadcrumbs"])/>