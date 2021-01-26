<!DOCTYPE html>

<#include init />

<html class="${root_css_class}" dir="<@liferay.language key="lang.dir" />" lang="${w3c_language_id}">

	<head>
		<title>${the_title} - ${company_name}</title>
		<meta charset="UTF-8">
		<meta content="initial-scale=1.0, width=device-width" name="viewport" />
		<@liferay_util["include"] page=top_head_include />		
	</head>

	<body class="${css_class}">

		<@liferay_ui["quick-access"] contentId="#main-content" />
		<@liferay_util["include"] page=body_top_include />
		<@liferay.control_menu />

		<div class="${prefix}" id="wrapper">

			<#include "${full_templates_path}/header.ftl" />

			<section id="content" class="container-fluid px-0">

				<#if show_breadcrumbs>
					<div class="secondary-container">
						<#assign breadcrumbPortletPreferences = {"portletSetupPortletDecoratorId": "barebone-titleless"} />
						<@liferay.breadcrumbs default_preferences=freeMarkerPortletPreferences.getPreferences(breadcrumbPortletPreferences) />
					</div>
				</#if>

				<h2 class="hide-accessible" role="heading" aria-level="1">${the_title}</h2>

				<#if selectable>
					<@liferay_util["include"] page=content_include />
				<#else>
					${portletDisplay.recycle()}
					${portletDisplay.setTitle(the_title)}
					<@liferay_theme["wrap-portlet"] page="portlet.ftl">
						<@liferay_util["include"] page=content_include />
					</@>
				</#if>
			</section>

			<#include "${full_templates_path}/footer.ftl" />

		</div>

		<div class="${prefix} liferay-instance">
			<@liferay_util["include"] page=body_bottom_include />
			<@liferay_util["include"] page=bottom_include />
		</div>

		<script type="text/javascript" src="${javascript_folder}/dist/bundle.js?<!--@timestamp-->"></script>
		
	</body>

</html>