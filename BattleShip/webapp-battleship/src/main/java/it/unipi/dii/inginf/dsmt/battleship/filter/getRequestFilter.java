package it.unipi.dii.inginf.dsmt.battleship.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter(filterName = "getRequestFilter", urlPatterns = {"/pages/result.jsp", "/access", "/pages/endgame", "/pages/game.jsp", "/pages/game"})
public class getRequestFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    /**
     * Checks that the user visiting the game result page has really just ended a game.
     * If not, redirects them to the homepage.
     */
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        String method = request.getMethod();
        if (method.equals("POST")) {
            filterChain.doFilter(request, response);
        } else {
            response.sendRedirect(request.getContextPath() + "/pages/homepage.jsp");
        }
    }

    public void destroy() {}
}
