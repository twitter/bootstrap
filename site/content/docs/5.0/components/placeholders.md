---
layout: docs
title: Placeholders
description: Create loading placeholders for your components or pages with Bootstrap placeholders, built entirely with HTML, CSS, and no JavaScript.
group: components
toc: true
---

## About

Bootstrap "placeholders" can be used to enhance the experience of your application. They're built only with HTML and CSS, meaning you don't need any JavaScript to create them. You will, however, need some custom JavaScript to toggle their visibility. Their appearance, color, and sizing can be easily customized with our amazing utility classes.

## Example

In this example we have built a fancy HTML card using Bootstrap components. Then using placeholders we have created a loading template for it. As you can see, the size and proportions are the same.

{{< example >}}
<div class="d-flex justify-content-around">
  <div class="card" style="width: 18rem;">
    {{< placeholder width="100%" height="180" class="card-img-top" text="false" background="#20c997" >}}
    <div class="card-body">
      <h5 class="card-title">Card title</h5>
      <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
      <a href="#" class="btn btn-primary">Go somewhere</a>
    </div>
  </div>

  <div class="card" aria-busy="true" aria-hidden="true" style="width: 18rem;">
    {{< placeholder width="100%" height="180" class="card-img-top" text="false" >}}
    <div class="card-body">
      <h5 class="card-title placeholder-glow">
        <span class="placeholder col-6"></span>&#8232;
      </h5>
      <p class="card-text placeholder-glow">
        <span class="placeholder col-7"></span>
        <span class="placeholder col-4"></span>
        <span class="placeholder col-4"></span>
        <span class="placeholder col-6"></span>
        <span class="placeholder col-8"></span>
      </p>
      <a href="#" tabindex="-1" class="btn btn-primary disabled placeholder col-6">
        &nbsp;<!-- needed to give the element some height -->
      </a>
    </div>
  </div>
</div>
{{< /example >}}

## How it works

Placeholders are composed of the class `.placeholder` and a grid column class, i.e. `.col-6`, to set the width of the placeholder. You only need to place them wherever you want.

{{< example >}}
<p aria-busy="true">
  <span class="placeholder col-6"></span>
</p>

<a href="#" class="btn btn-primary disabled placeholder col-4" aria-busy="true">
  &nbsp;<!-- to give the element some height -->
</a>
{{< /example >}}

{{< callout info >}}
Beside of using `aria-busy="true"` to indicate the subtree is being updated, if both, placeholder and the populated element, are present on the content, `aria-hidden="true"` should be used to hide one or another from screen readers.
{{< /callout >}}


### Width

You can customize them width with css widths or even using the utility classes.

{{< example >}}
<span class="placeholder col-6"></span>
<span class="placeholder w-75"></span>
<span class="placeholder" style="width: 25%;"></span>
{{< /example >}}

### Color

By default the `placeholder` use the `currentColor`. Again, you can override it with a custom color or utitlity class.

{{< example >}}
<span class="placeholder col-12"></span>
{{< placeholders.inline >}}
{{- range (index $.Site.Data "theme-colors") }}
<span class="placeholder col-12 bg-{{ .name }}"></span>
{{- end -}}
{{< /placeholders.inline >}}
{{< /example >}}

### Sizing

The size of the `.placeholder`s are calculated according to the typography style of the parent element. To customize them you can use classes like `.placeholder-lg`, `.placeholder-sm` or `.placeholder-xs`.

{{< example >}}
<span class="placeholder col-2 placeholder-lg"></span>
<span class="placeholder col-2"></span>
<span class="placeholder col-2 placeholder-sm"></span>
<span class="placeholder col-2 placeholder-xs"></span>
{{< /example >}}

### Animation

You can use the class `.placeholder-glow` or `.placeholder-wave` to animate the lines and improve the loading perception.

{{< example >}}
<p class="placeholder-glow">
  <span class="placeholder col-3"></span>
  <span class="placeholder col-3"></span>
  <span class="placeholder col-3"></span>
</p>

<p class="placeholder-wave">
  <span class="placeholder col-3"></span>
  <span class="placeholder col-3"></span>
  <span class="placeholder col-3"></span>
</p>
{{< /example >}}

## Sass

### Variables

{{< scss-docs name="placeholders" file="scss/_variables.scss" >}}

