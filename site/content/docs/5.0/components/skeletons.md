---
layout: docs
title: Skeletons
description: Create loading skeletons for your components or pages with Bootstrap skeleton, built entirely with HTML, CSS, and no JavaScript.
group: components
toc: true
---

## About

Bootstrap “skeletons” can be used to enhance the experience of your application. They’re built only with HTML and CSS, meaning you don’t need any JavaScript to create them. You will, however, need some custom JavaScript to toggle their visibility. Their appearance, color, and sizing can be easily customized with our amazing utility classes.

## Example

In this example we have built a fancy HTML card using Bootstrap components. Then using skeletons we have created a loading template for it. As you can see, the size and proportion is the same.

{{< example >}}
<div class="d-flex justify-content-around">
  <div class="card" style="width: 18rem;">
    {{< placeholder width="100%" height="180" class="card-img-top" text="false" background="#20c997" >}}
    <div class="card-body">
      <h5 class="card-title">
        Card title
      </h5>
      <p class="card-text">
        Some quick example text to build on the card title and make up the bulk of the card's content.
      </p>
      <a href="#" class="btn btn-primary">
        Go somewhere
      </a>
    </div>
  </div>

  <div class="card" aria-busy="true" style="width: 18rem;">
    {{< placeholder width="100%" height="180" class="card-img-top" text="false" >}}
    <div class="card-body">
      <h5 class="card-title">
        <span class="skeleton-line skeleton-glow w-50"><span class="skeleton-dash"></span>&#8232;</span>
      </h5>
      <p class="card-text">
        <span class="skeleton-line skeleton-glow skeleton-sm">
          <span class="skeleton-dash bg-secondary" style="width:60%"></span>
          <span class="skeleton-dash bg-secondary" style="width:35%"></span>
        </span>
        <span class="skeleton-line skeleton-glow skeleton-sm">
          <span class="skeleton-dash bg-secondary" style="width:35%"></span>
          <span class="skeleton-dash bg-secondary" style="width:50%"></span>
        </span>
        <span class="skeleton-line skeleton-glow skeleton-sm">
          <span class="skeleton-dash bg-secondary" style="width:70%"></span>
        </span>
      </p>
      <a href="#" class="btn btn-primary disabled" style="width:55%">
        <span class="skeleton-line w-100"></span>
      </a>
    </div>
  </div>

</div>
{{< /example >}}

## How it works

Skeletons are composed of `.skeleton-line`s. Each of them needs one or more `.skeleton-dash`es.

{{< example >}}
<span class="skeleton-line">
  <span class="skeleton-dash"></span>
</span>
{{< /example >}}

{{< callout info >}}
Beside of using `aria-busy="true"` to indicate the subtree is being updated, if both, skeleton and the populated element, are present on the content, `aria-hidden="true"` should be used to hide one or another from screen readers.
{{< /callout >}}


### Width

By default all `.skeleton-dash`es together will take the full with of the `.skeleton-line`. Still, you can customize them with custom css widths or even using the utility classes.

{{< example >}}
<span class="skeleton-line">
  <span class="skeleton-dash"></span>
  <span class="skeleton-dash"></span>
</span>
<span class="skeleton-line">
  <span class="skeleton-dash w-25"></span>
  <span class="skeleton-dash w-75"></span>
</span>
<span class="skeleton-line">
  <span class="skeleton-dash" style="width:60%"></span>
  <span class="skeleton-dash" style="width:25%"></span>
</span>
{{< /example >}}

### Color

By default the `skeleton-dash` use the `currentColor`. Again, you can override it with a custom color or utitlity class.

{{< example >}}
<span class="skeleton-line">
  <span class="skeleton-dash"></span>
</span>
<span class="skeleton-line">
  <span class="skeleton-dash bg-primary"></span>
  <span class="skeleton-dash bg-secondary"></span>
  <span class="skeleton-dash bg-success"></span>
  <span class="skeleton-dash bg-danger"></span>
  <span class="skeleton-dash bg-warning"></span>
  <span class="skeleton-dash bg-info"></span>
  <span class="skeleton-dash bg-light"></span>
  <span class="skeleton-dash bg-dark"></span>
  <span class="skeleton-dash bg-white"></span>
  <span class="skeleton-dash bg-transparent"></span>
</span>
{{< /example >}}

### Sizing
The size of the `.skeleton-dash`es are calculated according to the typography style of the parent element. To customize them  you can use classes like `.skeleton-lg`,  `.skeleton-sm` or `.skeleton-xs`.

{{< callout info >}}
Even if you use size modifiers, the space between lines is not affected, only the thickness of the dash. This is in purpose to help you customize the weights of the different elements of the skeleton composition.
{{< /callout >}}

{{< example >}}
<div class="d-flex justify-content-around">
  <div style="width:45%">
    <h3>
      <span class="skeleton-line"><span class="skeleton-dash"></span>&#8232;</span>
    </h3>
    <p>
      <span class="skeleton-line skeleton-lg"><span class="skeleton-dash"></span></span>
      <span class="skeleton-line"><span class="skeleton-dash"></span></span>
      <span class="skeleton-line skeleton-sm"><span class="skeleton-dash"></span></span>
      <span class="skeleton-line skeleton-xs"><span class="skeleton-dash"></span></span>
    </p>
  </div>
  <div style="width:45%">
    <h3>
      Example main title
    </h3>
    <p>
      The body text with different skeleton sizes applied. As you can see the height of the line inside the paragraph is not affected by the skeleton size.
    </p>
  </div>
</div>
{{< /example >}}

### Animation

You can use the class `.skeleton-glow` to animate the lines and improve the loading perception.

{{< example >}}
  <span class="skeleton-line skeleton-glow">
    <span class="skeleton-dash"></span>
  </span>
{{< /example >}}
