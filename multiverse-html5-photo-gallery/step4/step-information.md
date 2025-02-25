# Building the Footer

Now that we have completed the gallery, it's time to add some finishing touches, by completing the footer of the project.

1. Add the `footer` tag as a sibling to the `#gallery-container`.

   ```html
   <footer></footer>
   ```

2. Create two `<p>` tags inside `footer`. Create the first `<p>` tag and give it an `id` of `footer-title`. Add the text "Multiverse Gallery Project" to it.

3. For the second `<p>` tag, give it an ID of `about` and add the text "about" in it.

4. Add the icon `assets/info.svg` inside the `#info-icon` tag. With this, the HTMl Structure is complete.

5. Set the background color of the footer tag to `#1f2224`.

6. We also need to make the text color of the footer light. So, make the color of the footer `white`.

7. Fix the footer, by adding `position` as `fixed` and setting the `left` and `bottom` values to `0px`.

8. Add a `flex` container to the footer and give equal space between the `about` and `footer` title. Set the `justify-content` to `space-between` and `align-items` to `center`.

   ```css
   footer {
     display: flex;
     justify-content: space-between;
     align-items: center;
   }
   ```

Congratulations, you have come a long way! You have completed the project and learned a lot of new things starting from HTML Code to CSS Layouts. Submit this project using the `Submit Project` button on the bottom left of your page to get a personalised Code Report for your code and suggestions for some improvements that can be made. 

Take up the next [project](https://codedamn.com/projects) and start building.
