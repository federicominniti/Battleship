package it.unipi.dii.inginf.dsmt.battleship.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

@WebFilter(filterName = "GameFilter", urlPatterns = {"/pages/game.jsp"})
public class GameFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        String type = request.getMethod();
        if (type.equals("POST")) {
            filterChain.doFilter(request, response);
        } else {
            response.sendRedirect(request.getContextPath() + "./homepage.jsp");
        }
    }

    public void destroy() {

    }
}